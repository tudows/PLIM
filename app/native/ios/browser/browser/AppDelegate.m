//
//  AppDelegate.m
//  browser
//
//  Created by rabbit on 16/3/1.
//  Copyright © 2016年 rabbit. All rights reserved.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import "PasswordController.h"
#import "QRCodeScanController.h"
#import "iflyMSC/IFlyMSC.h"

@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    //打开输出在console的log开关
    [IFlySetting showLogcat:NO];
    
    NSString *initString = [[NSString alloc] initWithFormat:@"appid=%@",@"xxxxxxx"];
    [IFlySpeechUtility createUtility:initString];
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void(^)(BOOL succeeded))completionHandler{
    if([shortcutItem.type isEqualToString:@"3DTouch.scanQRCode"]) {
        QRCodeScanController * qrcodeScanVC = [[QRCodeScanController alloc]initWithNibName:@"QRCodeScanController" bundle:nil];
        qrcodeScanVC.delegate = self.window.rootViewController;
        [self.window.rootViewController presentViewController:qrcodeScanVC animated:YES completion:nil];
    }
    else {
        NSURL *url = [NSURL URLWithString:@"https://xxx"];
        if([shortcutItem.type isEqualToString:@"3DTouch.showPowerline"]) {
            url = [NSURL URLWithString:@"https://xxx/#/app/maintain/list"];
        }
        else if ([shortcutItem.type isEqualToString:@"3DTouch.voice"]) {
            url = [NSURL URLWithString:@"https://xxx/#/app/powerline/list"];
        }
        //    NSArray *arr = @[@"hello 3D Touch"];
        //    UIActivityViewController *vc = [[UIActivityViewController alloc]initWithActivityItems:arr applicationActivities:nil];
        //    //设置当前的VC 为rootVC
        //    [self.window.rootViewController presentViewController:vc animated:YES completion:^{
        //    }];
        // ViewController *vc = [[ViewController alloc] initWithValue: url];
        //    ViewController *vc = [[UIStoryboard storyboardWithName:@"Main" bundle:nil] instantiateViewControllerWithIdentifier:@"viewController"];
        //    vc.url = url;
        //    self.window.rootViewController = vc;
//        UIStoryboard* storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
//        ViewController *mainViewController = (ViewController*)[storyboard instantiateViewControllerWithIdentifier:@"viewController"];
//        mainViewController.url = url;
//        [self.window.rootViewController presentViewController:mainViewController animated:YES completion:nil];
        ViewController *mainViewController = (ViewController*)self.window.rootViewController;
        [mainViewController setUrl:url];
    }
}

@end
