import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import react_native_ota_hot_update

@main
class AppDelegate: RCTAppDelegate {
  var taskIdentifier: UIBackgroundTaskIdentifier = .invalid
  
  public override func applicationDidEnterBackground(_ application: UIApplication) {
    if taskIdentifier != .invalid {
      application.endBackgroundTask(taskIdentifier)
      taskIdentifier = .invalid
    }

    taskIdentifier = application.beginBackgroundTask(withName: "OTAUpdate") { [weak self] in
      if let strongSelf = self {
        application.endBackgroundTask(strongSelf.taskIdentifier)
        strongSelf.taskIdentifier = .invalid
      }
    }
  }

  public override func applicationWillEnterForeground(_ application: UIApplication) {
    if taskIdentifier != .invalid {
      application.endBackgroundTask(taskIdentifier)
      taskIdentifier = .invalid
    }
  }

  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "OTA_Inhouse"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    return OtaHotUpdate.getBundle() 
#endif
  }
}
