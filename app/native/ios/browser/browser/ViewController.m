//
//  ViewController.m
//  browser
//
//  Created by rabbit on 16/3/1.
//  Copyright © 2016年 rabbit. All rights reserved.
//

#import "ViewController.h"
#import "QRCodeScanController.h"
#import "PasswordController.h"
#import "iflyMSC/IFlySpeechConstant.h"
#import "iflyMSC/IFlyRecognizerViewDelegate.h"
#import "iflyMSC/IFlyRecognizerView.h"
#import "IATConfig.h"
@import LocalAuthentication;
@import Security;



@interface ViewController () <IFlyRecognizerViewDelegate> {
    IFlyRecognizerView *_iflyRecognizerView;
}

//@property (weak, nonatomic) IBOutlet UIButton *scanBtn;
@property (weak, nonatomic) IBOutlet UIView *lockView;
@property (weak, nonatomic) IBOutlet UIView *voiceView;


@end

@implementation ViewController

@synthesize webView = webView_;

//- (instancetype)initWithValue:(NSURL *)url {
//    self = [super init];
//    if (self) {
//        self.url = url;
//    }
//    return self;
//}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    // NSURL *url = [NSURL URLWithString:@"https://xxx"];
    
    if (_url == nil)
        _url = [NSURL URLWithString:@"https://xxx"];
    
//    NSURLRequest *request = [NSURLRequest requestWithURL:_url];
//    [webView_ loadRequest:request];
    [self.webView loadRequest:[[NSURLRequest alloc] initWithURL:_url]];
    
    [self addItemAsync];
    
    
    
    // [self performSelector:@selector(alertShow) withObject:nil afterDelay:1];
    
    
}

- (void)viewWillAppear:(BOOL)animated
{
    // [self performSelector:@selector(evaluatePolicy)];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appWillEnterForegroundNotification) name:UIApplicationWillEnterForegroundNotification object:nil];
    
    
    [super viewWillAppear:YES];
    
    // [[UIApplication sharedApplication] setStatusBarHidden:TRUE];
    // [self prefersStatusBarHidden];
    
//    UIView *statusBarView=[[UIView alloc] initWithFrame:CGRectMake(0, 0, 320, 20)];
//    
//    statusBarView.backgroundColor=[UIColor blackColor];
//    
//    [self.view addSubview:statusBarView];
//    
//    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:NO];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:YES];
    
    NSString *urlStr = [_url absoluteString];
    if ([urlStr isEqualToString:@"https://xxx/#/app/powerline/list"]) {
        [_voiceView setHidden:NO];
    }
    else {
        [self evaluatePolicy];
    }
}

- (void) appWillEnterForegroundNotification{
    // _window.rootViewController
//    for (UIViewController *controller in self.navigationController.viewControllers) {
//        if ([controller isKindOfClass:[PasswordController class]]) {
//            [self.navigationController popToViewController:controller animated:NO];
//        }
//    }
//    UIStoryboard* storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
//    PasswordController *passwordController = (PasswordController*)[storyboard instantiateViewControllerWithIdentifier:@"passwordController"];
//    [self.navigationController pushViewController:passwordController animated:YES];
    // [self.window.rootViewController presentViewController:passwordController animated:YES completion:nil];
    
    [self evaluatePolicy];
}

-(void) viewDidDisappear:(BOOL)animated{
    [_iflyRecognizerView cancel]; //取消识别
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (BOOL)prefersStatusBarHidden
{
    return NO;
}

- (IBAction)voiceBtn:(id)sender {
    if(_iflyRecognizerView == nil)
    {
        [self initRecognizer ];
    }
    
    //设置音频来源为麦克风
    [_iflyRecognizerView setParameter:@"1" forKey:@"audio_source"];
    
    //设置听写结果格式为json
    [_iflyRecognizerView setParameter:@"plain" forKey:[IFlySpeechConstant RESULT_TYPE]];
    
    //保存录音文件，保存在sdk工作路径中，如未设置工作路径，则默认保存在library/cache下
    [_iflyRecognizerView setParameter:@"asr.pcm" forKey:[IFlySpeechConstant ASR_AUDIO_PATH]];
    
    [_iflyRecognizerView start];
}

/*识别结果返回代理
 @param resultArray识别结果
 @ param isLast表示是否最后一次结果
 */
- (void)onResult: (NSArray *)resultArray isLast:(BOOL) isLast
{
    NSMutableString *result = [[NSMutableString alloc] init];
    NSDictionary *dic = [resultArray objectAtIndex:0];
    
    for (NSString *key in dic) {
        [result appendFormat:@"%@",key];
    }
//    NSLog(@"%@",result);
    [self setUrl:[NSURL URLWithString:[@"https://xxx/#/app/powerline/list/" stringByAppendingString:[result stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]]]];
    [_iflyRecognizerView cancel]; //取消识别
//    [_iflyRecognizerView setDelegate:nil];
//    [_iflyRecognizerView setParameter:@"" forKey:[IFlySpeechConstant PARAMS]];
    [_voiceView setHidden:YES];
    [self evaluatePolicy];
}
/*识别会话错误返回代理
 @ param    error错误码
 */
- (void)onError: (IFlySpeechError *)  error
{
}

- (IBAction)btnTouchUp:(id)sender {
    [self evaluatePolicy];
}

- (void)alertShow {
    NSLog(@"%@", _url);
//    UIAlertController *alert = [UIAlertController
//                                alertControllerWithTitle:@"url" message:_url.absoluteString
//                                preferredStyle:UIAlertControllerStyleAlert];
//    UIAlertAction *alerta = [UIAlertAction actionWithTitle:@"ok"
//                                                     style:UIAlertActionStyleDefault
//                                                   handler:^(UIAlertAction *_Nonnull action) {
//        NSLog(@"%@", _url);
//    }];
//    [alert addAction:alerta];
//    [self presentViewController:alert animated:YES completion:nil];
    
}

//- (IBAction)sacnBtnTouchUp:(id)sender {
//    QRCodeScanController * qrcodeScanVC = [[QRCodeScanController alloc]initWithNibName:@"QRCodeScanController" bundle:nil];
////    [self.navigationController pushViewController:qrcodeScanVC animated:YES];
//    [self presentViewController:qrcodeScanVC animated:YES completion:nil];
//}

- (void)setValue:(NSString *)value {
//    NSLog(value);
    _url = [NSURL URLWithString:[@"https://xxx/qrcode/analyse/" stringByAppendingString:value]];
//    NSURLRequest *request = [NSURLRequest requestWithURL:_url];
//    [webView_ loadRequest:request];
    
    [self.webView loadRequest:[[NSURLRequest alloc] initWithURL:_url]];
}

- (void)setUrl:(NSURL *)url {
    //    NSLog(value);
    _url = url;
//    NSURLRequest *request = [NSURLRequest requestWithURL:url];
//    [webView_ loadRequest:request];
    NSString *urlStr = [_url absoluteString];
    if ([urlStr isEqualToString:@"https://xxx/#/app/powerline/list"]) {
        [_voiceView setHidden:NO];
    }
    else {
        [self.webView loadRequest:[[NSURLRequest alloc] initWithURL:_url]];
    }
}


- (void)evaluatePolicy
{
    [_voiceView setHidden:YES];
    
    [webView_ setHidden:YES];
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0];
    CGPoint point = webView_.center;
    point.y = webView_.bounds.size.height * 3 / 2 + 20;
    [webView_ setCenter:point];
    [UIView commitAnimations];
    
    [_lockView setHidden:NO];
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0];
    CGPoint _point = _lockView.center;
    _point.y = _lockView.bounds.size.height / 2 + 20;
    [_lockView setCenter:_point];
    [UIView commitAnimations];
    
//    LAContext *context = [[LAContext alloc] init];
//    __block NSString *msg;
//    
//    // show the authentication UI with our reason string
//    [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:NSLocalizedString(@"解锁后才可使用", nil) reply:
//     ^(BOOL success, NSError *authenticationError) {
//         if (success) {
//             msg =[NSString stringWithFormat:NSLocalizedString(@"EVALUATE_POLICY_SUCCESS", nil)];
//             [[NSOperationQueue mainQueue] addOperationWithBlock:^{
//                 [_webView setHidden:NO];
//                 [UIView beginAnimations:nil context:nil];
//                 [UIView setAnimationDuration:0.5];
//                 CGPoint point = _webView.center;
//                 point.y = _webView.bounds.size.height / 2 + 20;
//                 [_webView setCenter:point];
//                 [UIView commitAnimations];
//             }];
//         } else {
//             msg = [NSString stringWithFormat:NSLocalizedString(@"EVALUATE_POLICY_WITH_ERROR", nil), authenticationError.localizedDescription];
//             [[NSOperationQueue mainQueue] addOperationWithBlock:^{
//                 // [self evaluatePolicy];
//             }];
//         }
//         NSLog(@"%@", msg);
//     }];
    
    
    NSDictionary *query = @{
                            (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
                            (__bridge id)kSecAttrService: @"SampleService",
                            (__bridge id)kSecReturnData: @YES,
                            (__bridge id)kSecUseOperationPrompt: NSLocalizedString(@"解锁后才可使用", nil)
                            };
    
    
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        CFTypeRef dataTypeRef = NULL;
        
        OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)(query), &dataTypeRef);
        NSData *resultData = (__bridge NSData *)dataTypeRef;
        NSString * result = [[NSString alloc] initWithData:resultData encoding:NSUTF8StringEncoding];
        
        NSString *msg = [NSString stringWithFormat:NSLocalizedString(@"SEC_ITEM_COPY_MATCHING_STATUS", nil), [self keychainErrorToString:status]];
        if (resultData)
            msg = [msg stringByAppendingString:[NSString stringWithFormat:NSLocalizedString(@"RESULT", nil), result]];
        
        NSLog(@"%@", msg);
        
        if (status != -128) {
            [[NSOperationQueue mainQueue] addOperationWithBlock:^{
                [webView_ setHidden:NO];
                [UIView beginAnimations:nil context:nil];
                [UIView setAnimationDuration:0.5];
                CGPoint point = webView_.center;
                point.y = webView_.bounds.size.height / 2 + 20;
                [webView_ setCenter:point];
                [UIView commitAnimations];
                
                [_lockView setHidden:YES];
                [UIView beginAnimations:nil context:nil];
                [UIView setAnimationDuration:0];
                CGPoint _point = _lockView.center;
                _point.y = _lockView.bounds.size.height * 3 / 2 + 20;
                [_lockView setCenter:_point];
                [UIView commitAnimations];
            }];
        }
    });
}

- (void)addItemAsync
{
    CFErrorRef error = NULL;
    SecAccessControlRef sacObject;
    
    // Should be the secret invalidated when passcode is removed? If not then use kSecAttrAccessibleWhenUnlocked
    sacObject = SecAccessControlCreateWithFlags(kCFAllocatorDefault,
                                                kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,
                                                kSecAccessControlUserPresence, &error);
    if(sacObject == NULL || error != NULL)
    {
        NSLog(@"can't create sacObject: %@", error);
        // self.textView.text = [_textView.text stringByAppendingString:[NSString stringWithFormat:NSLocalizedString(@"SEC_ITEM_ADD_CAN_CREATE_OBJECT", nil), error]];
        return;
    }
    
    // we want the operation to fail if there is an item which needs authenticaiton so we will use
    // kSecUseNoAuthenticationUI
    NSDictionary *attributes = @{
                                 (__bridge id)kSecClass: (__bridge id)kSecClassGenericPassword,
                                 (__bridge id)kSecAttrService: @"SampleService",
                                 (__bridge id)kSecValueData: [@"SECRET_PASSWORD_TEXT" dataUsingEncoding:NSUTF8StringEncoding],
                                 (__bridge id)kSecUseNoAuthenticationUI: @YES,
                                 (__bridge id)kSecAttrAccessControl: (__bridge id)sacObject
                                 };
    
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        OSStatus status =  SecItemAdd((__bridge CFDictionaryRef)attributes, nil);
        
        NSString *msg = [NSString stringWithFormat:NSLocalizedString(@"SEC_ITEM_ADD_STATUS", nil), [self keychainErrorToString:status]];
        // [self printResult:self.textView message:msg];
    });
}

- (NSString *)keychainErrorToString: (NSInteger)error
{
    
    NSString *msg = [NSString stringWithFormat:@"%ld",(long)error];
    
    switch (error) {
        case errSecSuccess:
            msg = NSLocalizedString(@"SUCCESS", nil);
            break;
        case errSecDuplicateItem:
            msg = NSLocalizedString(@"ERROR_ITEM_ALREADY_EXISTS", nil);
            break;
        case errSecItemNotFound :
            msg = NSLocalizedString(@"ERROR_ITEM_NOT_FOUND", nil);
            break;
        case -26276: // this error will be replaced by errSecAuthFailed
            msg = NSLocalizedString(@"ERROR_ITEM_AUTHENTICATION_FAILED", nil);
            
        default:
            break;
    }
    
    return msg;
}

-( CABasicAnimation *)moveX:( float )time X:( NSNumber *)x

{
    
    CABasicAnimation *animation = [ CABasicAnimation animationWithKeyPath : @"transform.translation.x" ]; ///.y 的话就向下移动。
    
    animation. toValue = x;
    
    animation. duration = time;
    
    animation. removedOnCompletion = YES ; //yes 的话，又返回原位置了。
    
    animation. repeatCount = MAXFLOAT ;
    
    animation. fillMode = kCAFillModeForwards ;
    
    return animation;
    
}

/**
 设置识别参数
 ****/
-(void)initRecognizer
{
    //单例模式，UI的实例
    if (_iflyRecognizerView == nil) {
        //UI显示剧中
        _iflyRecognizerView= [[IFlyRecognizerView alloc] initWithCenter:self.view.center];
        
        [_iflyRecognizerView setParameter:@"" forKey:[IFlySpeechConstant PARAMS]];
        
        //设置听写模式
        [_iflyRecognizerView setParameter:@"iat" forKey:[IFlySpeechConstant IFLY_DOMAIN]];
        
    }
    _iflyRecognizerView.delegate = self;
    
    if (_iflyRecognizerView != nil) {
        IATConfig *instance = [IATConfig sharedInstance];
        
        [IATConfig sharedInstance].haveView = YES;
        
        //设置最长录音时间
        [_iflyRecognizerView setParameter:instance.speechTimeout forKey:[IFlySpeechConstant SPEECH_TIMEOUT]];
        //设置后端点
        [_iflyRecognizerView setParameter:instance.vadEos forKey:[IFlySpeechConstant VAD_EOS]];
        //设置前端点
        [_iflyRecognizerView setParameter:instance.vadBos forKey:[IFlySpeechConstant VAD_BOS]];
        //网络等待时间
        [_iflyRecognizerView setParameter:@"20000" forKey:[IFlySpeechConstant NET_TIMEOUT]];
        
        //设置采样率，推荐使用16K
        [_iflyRecognizerView setParameter:instance.sampleRate forKey:[IFlySpeechConstant SAMPLE_RATE]];
        if ([instance.language isEqualToString:[IATConfig chinese]]) {
            //设置语言
            [_iflyRecognizerView setParameter:instance.language forKey:[IFlySpeechConstant LANGUAGE]];
            //设置方言
            [_iflyRecognizerView setParameter:instance.accent forKey:[IFlySpeechConstant ACCENT]];
        }else if ([instance.language isEqualToString:[IATConfig english]]) {
            //设置语言
            [_iflyRecognizerView setParameter:instance.language forKey:[IFlySpeechConstant LANGUAGE]];
        }
        //设置是否返回标点符号
        [_iflyRecognizerView setParameter:instance.dot forKey:[IFlySpeechConstant ASR_PTT]];
        
    }
}


@end
