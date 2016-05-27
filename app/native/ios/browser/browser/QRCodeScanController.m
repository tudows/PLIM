
//NOTE: 二维码扫描实现。  生成二维码以及扫描二维码实现方式是基于AVFoundation库，由于Apple 在 IOS8.0后才
//      提供了从相册识别二维码的新特性（代码中已被注释掉），为了兼容IOS8.0以前机型，故识别相片二维码信息采用的是开源库ZXINGObjc.
//      ZBar  Zxing均已停止更新且不支持64位架构。

#import "QRCodeScanController.h"
#import "NSObject+GCD.h"

@interface QRCodeScanController ()

@property (weak, nonatomic) IBOutlet UIImageView *scanBackgrondImageView;

@property (weak, nonatomic) IBOutlet UIView *scanContainerView;

@property (weak, nonatomic) IBOutlet UIView *scanView;

@property (weak, nonatomic) IBOutlet UILabel *statusLabel;

@property(strong,nonatomic) AVCaptureSession *session; // 二维码生成的绘画

@property(strong,nonatomic)  AVCaptureVideoPreviewLayer *previewLayer;

@property(assign,nonatomic) BOOL finished;

@property (nonatomic,strong)UIImageView * readLineView;

//扫描器灰色蒙板。
@property (nonatomic,strong)CALayer * maskLayer;

@property(nonatomic,strong)CIDetector * detector;

@property(nonatomic,assign)CMVideoDimensions dimensions;

@property (nonatomic,strong) NSString * albumId;
@property (weak, nonatomic) IBOutlet UILabel *remindLabel;

@end

@implementation QRCodeScanController

- (void)dealloc{
    
    // 删除预览图层
    if (self.previewLayer) {
        [self.previewLayer removeFromSuperlayer];
    }
    if (self.maskLayer) {
        self.maskLayer.delegate = nil;
    }
    NSLog(@"%@ will dealloc !",NSStringFromClass([self class]));
}



- (void)viewDidLoad {
    [super viewDidLoad];

    self.navigationController.navigationBar.translucent = NO;
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:YES];
}


- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self stopScanning:self.session];
}

-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    if (!self.session) {
        [self readQRcode];
    }
}

- (void)onCancelBarButtonTouched:(id)sender{
    [self dismissViewControllerAnimated:YES completion:nil];
}
- (IBAction)backBtnTouchUp:(id)sender {
//    NSString *str = @"123";
//    [self.delegate setValue:str];
    [self dismissViewControllerAnimated:YES completion:nil];
}

//ios8.0及以上版本可使用。
- (CIDetector *)detector{
    if (_detector == nil) {
        NSDictionary * options = @{CIDetectorAccuracy : CIDetectorAccuracyHigh};
        _detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:options];
    }
    return _detector;
}


- (void)doneButtonTouched:(id)sender{
    if (self.finished) {
        // 1. 如果扫描完成，停止会话
        
        [self stopScanning:self.session];
        
        // 2. 删除预览图层
        
        [self.previewLayer removeFromSuperlayer];
    }
    
    [self dismissViewControllerAnimated:YES completion:^{
        
    }];
}

- (void)setStatusText:(NSString *)text{
    
    CGRect stringRect = [text boundingRectWithSize:CGSizeMake(self.statusLabel.frame.size.width, 80.0)
                                                  options:(NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading)
                                               attributes:@{ NSFontAttributeName : self.statusLabel.font }
                                                  context:nil];
    CGRect rect = self.statusLabel.frame;
    rect.size.height = MAX(stringRect.size.height, rect.size.height);
    self.statusLabel.frame = rect;
    self.statusLabel.text = text;
}

//停止扫描
- (void)stopScanning:(AVCaptureSession *)session{
    
    [session stopRunning];
    safe_dispatch_main_async(^{
        [self.scanBackgrondImageView.layer removeAllAnimations];
    });
}

//开始扫描
- (void)startScanning:(AVCaptureSession *)session{
    [session startRunning];
    safe_dispatch_main_async(^{
        if (_readLineView) {
            [self.scanBackgrondImageView.layer removeAllAnimations];
        }else{
            [self loopDrawLine];
        }
    });
}


#pragma mark 扫描动画
-(void)loopDrawLine{
    
    CGRect screenBounds = [[UIScreen mainScreen] bounds];
    CGFloat scaleX = screenBounds.size.width/320.0;
    CGFloat loopLineWidth = 244.0 * scaleX;
    
    CGRect rect = CGRectMake(0, 5, loopLineWidth, 2);
    if (_readLineView) {
        [_readLineView removeFromSuperview];
    }
    __weak QRCodeScanController *weakSelf = self;
    weakSelf.readLineView = [[UIImageView alloc] initWithFrame:rect];
    [_readLineView setImage:[UIImage imageNamed:@"scan_line.png"]];
    [UIView animateWithDuration:1.5
                          delay: 0.0
                        options: UIViewAnimationOptionCurveEaseIn
                     animations:^{
                         //修改fream的代码写在这里
                         weakSelf.readLineView.frame =CGRectMake(weakSelf.scanBackgrondImageView.frame.origin.x, weakSelf.scanBackgrondImageView.frame.origin.y+weakSelf.scanBackgrondImageView.frame.size.height - 5, loopLineWidth, 2);
                         [weakSelf.readLineView setAnimationRepeatCount:0];
                         
                     }
                     completion:^(BOOL finished){
                         [weakSelf loopDrawLine];
                     }];
    
    [weakSelf.scanBackgrondImageView addSubview:weakSelf.readLineView];
}


#pragma mark - 读取二维码

- (void)readQRcode{
    
    // 1. 摄像头设备
    
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    
    
    
    // 2. 设置输入
    
    // 因为模拟器是没有摄像头的，因此在此最好做一个判断
    
    NSError *error = nil;
    
    AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:device error:&error];
    
    if (error) {
        
        NSLog(@"没有摄像头-%@", error.localizedDescription);
        
        return;
    }

    // 3. 设置输出(Metadata元数据)
    
    AVCaptureMetadataOutput *output = [[AVCaptureMetadataOutput alloc] init];
    
    // 3.1 设置输出的代理
    
    // 说明：使用主线程队列，相应比较同步，使用其他队列，相应不同步，容易让用户产生不好的体验
    
    [output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
    
    // 4. 拍摄会话
    
    //在生成拍摄回话时原来直接设置的是最高清画质，但对于ipod 5这类低配设备是不支持的，故在此我采取了下面这种方式来设置画质。
    AVCaptureSession *session = [[AVCaptureSession alloc] init];
    if ([device supportsAVCaptureSessionPreset:AVCaptureSessionPreset1920x1080]) {
        session.sessionPreset = AVCaptureSessionPreset1920x1080;//设置图像输出质量
        self.dimensions = (CMVideoDimensions){1080,1920};
    }else if ([device supportsAVCaptureSessionPreset:AVCaptureSessionPreset1280x720]){
        session.sessionPreset = AVCaptureSessionPreset1280x720;
        self.dimensions = (CMVideoDimensions){720,1280};
    }else if ([device supportsAVCaptureSessionPreset:AVCaptureSessionPreset640x480]){
        session.sessionPreset = AVCaptureSessionPreset640x480;
        self.dimensions = (CMVideoDimensions){480,640};
    }else if ([device supportsAVCaptureSessionPreset:AVCaptureSessionPreset352x288]){
        session.sessionPreset = AVCaptureSessionPreset352x288;
        self.dimensions = (CMVideoDimensions){288,352};
    }
    
    // 添加session的输入和输出
    
    [session addInput:input];
    
    [session addOutput:output];
    
    // 4.1 设置输出的格式
    
    // 提示：一定要先设置会话的输出为output之后，再指定输出的元数据类型！
    
    [output setMetadataObjectTypes:@[AVMetadataObjectTypeQRCode]];
    
    CGRect scanBounds = [self.view bounds];
    
    // 5. 设置预览图层（用来让用户能够看到扫描情况）
    
    AVCaptureVideoPreviewLayer *preview = [AVCaptureVideoPreviewLayer layerWithSession:session];
    
    // 5.1 设置preview图层的属性
    
    [preview setVideoGravity:AVLayerVideoGravityResizeAspectFill];
    
    // 5.2 设置preview图层的大小
    
    [preview setFrame:scanBounds];
    
    preview.backgroundColor = [UIColor lightGrayColor].CGColor;
    
    // 5.3 将图层添加到视图的图层
    
    [self.view.layer insertSublayer:preview atIndex:0];
    
    self.previewLayer = preview;
    
    self.maskLayer = [[CALayer alloc]init];
    self.maskLayer.frame = self.view.layer.bounds;
    self.maskLayer.delegate = self;
    [self.view.layer insertSublayer:self.maskLayer above:self.previewLayer];
    [self.maskLayer setNeedsDisplay];
    
    
    //5.4设置扫描区域
    
    /*获取图像输出大小*/
    CMVideoDimensions dimensions = self.dimensions;
    CGFloat width = dimensions.width;
    CGFloat height = dimensions.height;
    
    CGSize size = scanBounds.size;
    
    CGRect screenBounds = [[UIScreen mainScreen] bounds];
    CGFloat scaleX = screenBounds.size.width/320.0;
    CGFloat scaleY = screenBounds.size.height/568.0;
    CGRect scanFrame = [self.view convertRect:self.scanView.frame fromView:self.scanView.superview];
    CGRect cropRect = CGRectMake(scanFrame.origin.x * scaleX, scanFrame.origin.y * scaleY, scanFrame.size.width*scaleX, scanFrame.size.height * scaleY);
    
    CGFloat p1 = size.height/size.width;
    CGFloat p2 = height/width; //与之前设置的图像输出质量应该对应。
    if (p1 < p2) {
        CGFloat fixHeight = self.view.bounds.size.width * height / width; //缩放并剪裁后的高度。
        CGFloat fixPadding = (fixHeight - size.height)/2;
        output.rectOfInterest = CGRectMake((cropRect.origin.y + fixPadding)/fixHeight,
                                           cropRect.origin.x/size.width,
                                           cropRect.size.height/fixHeight,
                                           cropRect.size.width/size.width);
    } else {
        CGFloat fixWidth = self.view.bounds.size.height * width / height;
        CGFloat fixPadding = (fixWidth - size.width)/2;
        output.rectOfInterest = CGRectMake(cropRect.origin.y/size.height,
                                           (cropRect.origin.x + fixPadding)/fixWidth,
                                           cropRect.size.height/size.height,
                                           cropRect.size.width/fixWidth);
    }
    //说明: rectOfInterest 参数和普通的Rect范围不太一样，它的四个值的范围都是0-1，表示比例
    //      参数里的x对应的恰恰是距离左上角的垂直距离，y对应的是距离左上角的水平距离,宽度和高度设置的情况也是类似
    //      举个例子如果我们想让扫描的处理区域是屏幕的下半部分，我们这样设置  output.rectOfInterest=CGRectMake(0.5,0,0.5, 1)
    
    // 6. 启动会话
    
    [self startScanning:session];
    
    self.session = session;
    
}




#pragma mark - 输出代理方法

// 此方法是在识别到QRCode，并且完成转换

// 如果QRCode的内容越大，转换需要的时间就越长

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputMetadataObjects:(NSArray *)metadataObjects fromConnection:(AVCaptureConnection *)connection{
    
    // 扫描结果
    
    if (metadataObjects.count > 0) {
        
        AVMetadataMachineReadableCodeObject *obj = metadataObjects[0];
        NSString *result = obj.stringValue;
        
        self.remindLabel.text = [NSString stringWithFormat:@"扫描结果:%@",result];
        //result 即为扫描得到的结果。
        //可以开始对扫描得到的结果进行相应处理了。
        
        
        [self.delegate setValue:result];
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}




//Note: 蒙板生成。需设置代理，并在退出页面时取消代理。
-(void)drawLayer:(CALayer *)layer inContext:(CGContextRef)ctx{
    if (layer == self.maskLayer) {
        UIGraphicsBeginImageContextWithOptions(self.maskLayer.frame.size, NO, 1.0);
        CGContextSetFillColorWithColor(ctx, [UIColor colorWithRed:0 green:0 blue:0 alpha:0.6].CGColor);
        CGContextFillRect(ctx, self.maskLayer.frame);
        CGRect scanFrame = [self.view convertRect:self.scanView.frame fromView:self.scanView.superview];
        CGContextClearRect(ctx, scanFrame);
    }
}


@end
