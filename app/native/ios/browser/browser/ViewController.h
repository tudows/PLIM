//
//  ViewController.h
//  browser
//
//  Created by rabbit on 16/3/1.
//  Copyright © 2016年 rabbit. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

@property (nonatomic, strong) NSURL *url;

- (void)setUrl:(NSURL *)url;

// - (instancetype)initWithValue:(NSURL *)url;

@property (strong, nonatomic) IBOutlet UIWebView *webView;

@end

