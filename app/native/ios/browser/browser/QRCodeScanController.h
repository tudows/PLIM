
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
@protocol getQRCode <NSObject>

- (void)setValue:(NSString *)value;

@end
@interface QRCodeScanController : UIViewController<AVCaptureMetadataOutputObjectsDelegate>
@property(nonatomic, assign)id<getQRCode> delegate;
@end
