//
//  comCLController.m
//  iPadTcer
//
//  Created by rimu boddy on 29/08/12.
//  Copyright (c) 2012 rimu boddy. All rights reserved.
//


#import "comCLController.h"

@implementation comCLController
@synthesize locationManager, currentLocation;
@synthesize delegate;
NSString *LOCATION_EVENT = @"locationUpdated";
NSString *ERROR_EVENT = @"error";

- (NSArray<NSString *> *)supportedEvents
{
  return @[LOCATION_EVENT, ERROR_EVENT];
}

RCT_EXPORT_MODULE()

- (id) init {
    self = [super init];
    locationManager = [[CLLocationManager alloc] init];
    [locationManager setDelegate:self]; // send loc updates to myself
    locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation;
    return self;
}


RCT_EXPORT_METHOD(start) {
  [locationManager requestAlwaysAuthorization];
  [locationManager startUpdatingLocation];
}

RCT_EXPORT_METHOD(stop) {
  [locationManager stopUpdatingLocation];
}

- (NSDictionary *) generateLocationValues: (CLLocation *) newLocation {
  NSDictionary *values = [[NSMutableDictionary alloc] init];
  NSDate *timestamp = [[NSDate alloc] init];
  int unix = [timestamp timeIntervalSince1970];
  [values setValue: [NSNumber numberWithDouble: newLocation.coordinate.latitude] forKey:@"latitude"];
  [values setValue: [NSNumber numberWithDouble: newLocation.coordinate.longitude] forKey:@"longitude"];
  [values setValue: [NSNumber numberWithInt: unix] forKey:@"timestamp"];
  [values setValue: [NSNumber numberWithInt: [newLocation horizontalAccuracy]] forKey: @"horizontalAccuracy"];
  [values setValue: [NSNumber numberWithInt: [newLocation verticalAccuracy]] forKey:@"verticalAccuracy"];
  [values setValue: [NSNumber numberWithDouble: [newLocation speed]] forKey:@"speedMps"];
  [values setValue: [NSNumber numberWithDouble: [newLocation speed] * 1.944] forKey:@"speedKts"];
  [values setValue: [NSNumber numberWithDouble: [newLocation course]] forKey:@"course"];
  return values;
}

-(NSDictionary *) generateNullValues {
  NSDictionary *values = [[NSMutableDictionary alloc] init];
  [values setValue: [[NSNull alloc] init]  forKey:@"latitude"];
  [values setValue: [[NSNull alloc] init] forKey:@"longitude"];
  [values setValue: [[NSNull alloc] init]  forKey:@"timestamp"];
  [values setValue: [[NSNull alloc] init]  forKey: @"horizontalAccuracy"];
  [values setValue: [[NSNull alloc] init]  forKey:@"verticalAccuracy"];
  [values setValue: [[NSNull alloc] init]  forKey:@"speedMps"];
  [values setValue: [[NSNull alloc] init]  forKey:@"speedKts"];
  [values setValue: [[NSNull alloc] init]  forKey:@"course"];
  return values;
}

- (void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation {
    // test the age of the location measurement to determine if the measurement is cached
    // in most cases you will not want to rely on cached measurements
    NSTimeInterval locationAge = -[newLocation.timestamp timeIntervalSinceNow];
    if (locationAge > 10.0) return;

    // test that the horizontal accuracy does not indicate an invalid measurement
    if (newLocation.horizontalAccuracy > 10) {
    //NSDictionary *nullValues = [self generateNullValues];
    //[self sendEventWithName:LOCATION_EVENT body: nullValues];
    };

    // test the measurement to see if it is more accurate than the previous measurement
    // if (currentLocation == nil || currentLocation.horizontalAccuracy > newLocation.horizontalAccuracy) {
    // store the location as the "best effort"

    // test the measurement to see if it meets the desired accuracy
    //
    // IMPORTANT!!! kCLLocationAccuracyBest should not be used for comparison with location coordinate or altitidue
    // accuracy because it is a negative value. Instead, compare against some predetermined "real" measure of
    // acceptable accuracy, or depend on the timeout to stop updating. This sample depends on the timeout.
    //

    if (newLocation.horizontalAccuracy <= 10) { // 10 meteres is the crappiest location we can handle
        // we have a measurement that meets our requirements, so we can stop updating the location
        //
        // IMPORTANT!!! Minimize power usage by stopping the location manager as soon as possible.
        //
        // [locationManager stopUpdatingLocation];
        //[NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(stopUpdatingLocation:) object:nil];
        // we can also cancel our previous performSelector:withObject:afterDelay: - it's no longer necessary
      NSDictionary *values = [self generateLocationValues:newLocation];
      [self sendEventWithName:LOCATION_EVENT body: values];

    }
    //}
}

-(void) stopLocation{
    [locationManager stopUpdatingLocation];
}


- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
  NSDictionary *values = [[NSMutableDictionary alloc] init];
  [values setValue:error forKey:@"error"];
  [self sendEventWithName:ERROR_EVENT body: values];
}

@end
