//
//  comCLController.h
//  iPadTcer
//
//  Created by rimu boddy on 29/08/12.
//  Copyright (c) 2012 rimu boddy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <UIKit/UIKit.h>
#import "React/RCTBridge.h"
#import "React/RCTEventEmitter.h"

@interface comCLController : RCTEventEmitter <RCTBridgeModule ,CLLocationManagerDelegate> {
    CLLocationManager *locationManager;
    id delegate;
    int *count;
    @private NSLock *lock;
}

@property (nonatomic) id  delegate;


@property (strong, nonatomic) CLLocationManager *locationManager;
@property (strong, nonatomic) CLLocation *currentLocation;

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *) newLocation fromLocation:(CLLocation *) oldLocation;
- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error;
- (void) stopLocation;
@end


