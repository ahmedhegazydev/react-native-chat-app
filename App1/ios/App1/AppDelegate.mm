#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTI18nUtil.h>
// #import <FirebaseCore/FirebaseCore.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Enable RTL layout
  [[RCTI18nUtil sharedInstance] allowRTL:YES];
  [[RCTI18nUtil sharedInstance] forceRTL:YES];

  self.moduleName = @"App1";
  self.initialProps = @{};
  
  // Ensure Firebase is configured
      // if ([FIRApp defaultApp] == nil) {
      //     [FIRApp configure];
      // }
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
// {
// #if DEBUG
//   return [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios&dev=true"];
// #else
//   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
// #endif
// }

- (NSURL *)bundleURL {
#if DEBUG
  return [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios&dev=true"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
