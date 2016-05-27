//
//  PasswordController.m
//  browser
//
//  Created by rabbit on 16/4/9.
//  Copyright © 2016年 rabbit. All rights reserved.
//

#import "PasswordController.h"
#import "ViewController.h"
@import LocalAuthentication;

@interface PasswordController ()

@end

@implementation PasswordController


- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewWillAppear:YES];
    
    [self evaluatePolicy];
}

- (IBAction)btnTouchUp:(id)sender {
    [self evaluatePolicy];
}

- (void)evaluatePolicy
{
    LAContext *context = [[LAContext alloc] init];
    // __block NSString *msg;
    
    // show the authentication UI with our reason string
    [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:NSLocalizedString(@"解锁后才可使用", nil) reply:
     ^(BOOL success, NSError *authenticationError) {
         if (success) {
             // msg =[NSString stringWithFormat:NSLocalizedString(@"EVALUATE_POLICY_SUCCESS", nil)];
             [[NSOperationQueue mainQueue] addOperationWithBlock:^{
                 BOOL isExisted = false;
                 for (UIViewController *controller in self.navigationController.viewControllers) {
                     if ([controller isKindOfClass:[ViewController class]]) {
                         isExisted = true;
                         ViewController *viewController = (ViewController*)controller;
                         viewController.url = self.url;
                         // [self.navigationController popToViewController:self animated:YES];
                     }
                 }
                 if (isExisted) {
                     [self.navigationController popViewControllerAnimated:YES];
                 }
                 else {
                     UIStoryboard* storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:[NSBundle mainBundle]];
                     ViewController *viewController = (ViewController*)[storyboard instantiateViewControllerWithIdentifier:@"viewController"];
                     [viewController.navigationController setNavigationBarHidden:YES];
                     viewController.url = self.url;
                     [self.navigationController pushViewController:viewController animated:YES];
                 }
             }];
             
         } else {
             // msg = [NSString stringWithFormat:NSLocalizedString(@"EVALUATE_POLICY_WITH_ERROR", nil), authenticationError.localizedDescription];
         }
     }];
}

@end