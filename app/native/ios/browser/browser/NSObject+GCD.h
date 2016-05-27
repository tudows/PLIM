
#import <Foundation/Foundation.h>

@interface NSObject (GCD)

-(void) asyncTask:(dispatch_block_t)block;

-(void) syncTaskOnMain:(dispatch_block_t)block;

-(void) asyncTask:(dispatch_block_t)block after:(NSTimeInterval)delay;

-(void) syncTaskOnMain:(dispatch_block_t)block after:(NSTimeInterval)delay;

-(void) asyncTask:(dispatch_block_t)block returnOnMain:(dispatch_block_t)block2;

@end

void safe_dispatch_main_sync(dispatch_block_t block);

void safe_dispatch_main_async(dispatch_block_t block);