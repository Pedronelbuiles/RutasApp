// import Geolocation from "@react-native-community/geolocation";
import Geolocation from 'react-native-geolocation-service';
import { useEffect, useRef, useState } from "react";
import { Location } from '../interfaces/appInterfaces';

export const useLocation = () => {

    const [hasLocation, setHasLocation] = useState(false)
    const [routeLines, setRouteLines] = useState<Location[]>([])

    const [initialPosition, setInitialPosition] = useState<Location>({
        longitude: 0,
        latitude: 0
    })
    const [userLocation, setUserLocation] = useState<Location>({
        longitude: 0,
        latitude: 0
    })
    const watchId = useRef<number>()
    const isMounted = useRef(true)

    const getCurrentLocation = (): Promise<Location> => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                ({coords}) => {
                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    })
                },
                error => reject(error),
                { 
                    enableHighAccuracy:true,
                    timeout:20000,
                    maximumAge: 1000
                });
        })
    }

    const followUserLocation = () => {
        watchId.current = Geolocation.watchPosition(
            ({coords}) => {
                
                if (!isMounted.current) return

                const location: Location = {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }
                setUserLocation(location)
                setRouteLines( routes => [ ...routes, location])
            },
            error => console.log(error),
            { 
                enableHighAccuracy:true,
                distanceFilter: 10
            });
    }

    const stopFollowUserLocation = () => {
        if (watchId.current) {
            Geolocation.clearWatch(watchId.current)
        }
    }

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        getCurrentLocation()
            .then(location => {

                if (!isMounted.current) return

                setInitialPosition(location)
                setUserLocation(location)
                setRouteLines( routes => [ ...routes, location])
                setHasLocation(true)
            })
    }, [])

    return {
        initialPosition,
        hasLocation,
        userLocation,
        routeLines,
        getCurrentLocation,
        followUserLocation,
        stopFollowUserLocation
    }
}
