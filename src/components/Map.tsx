import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';

interface Props {
    markers?: Marker[];
}

export const Map = ({markers}: Props) => {

    const [showPoliLine, setShowPoliLine] = useState(true)

    const {hasLocation, initialPosition, userLocation, routeLines, getCurrentLocation, followUserLocation, stopFollowUserLocation} = useLocation()
    const mapviewref = useRef<MapView>()
    const following = useRef<boolean>(true)

    const centerPosition = async () => {
        const {latitude, longitude} = await getCurrentLocation()

        following.current = true

        mapviewref.current?.animateCamera({
            center: {latitude, longitude}
        })
    }

    useEffect(() => {
        followUserLocation()
        return () => {
            stopFollowUserLocation()
        }
    }, [])

    useEffect(() => {
        if (!following.current) return

        const { latitude, longitude} = userLocation
        mapviewref.current?.animateCamera({
            center: {latitude, longitude}
        })
    }, [userLocation])

    if (!hasLocation) {
        return <LoadingScreen />
    }
    

    return (
        <>
            <MapView
                ref={(el) => mapviewref.current = el!}
                style={{flex: 1}}
                showsUserLocation
                initialRegion={{
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onTouchStart={() => following.current = false}
            >
                {
                    showPoliLine && (
                        <Polyline 
                            coordinates={routeLines}
                            strokeColor="black"
                            strokeWidth={3}
                        />
                    )
                }
                    {/* <Marker 
                        image={require('../assets/custom-marker.png')}
                        coordinate={{
                            latitude: 37.78825,
                            longitude: -122.4324
                        }}
                        title="Titulo del marcador"
                        description="Esto en una descripción del marcador"
                    /> */}
            </MapView>   
            <Fab 
                iconName="compass-outline"
                onPress={centerPosition}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }}
            />

            <Fab 
                iconName="brush-outline"
                onPress={() => setShowPoliLine(!showPoliLine)}
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: 20
                }}
            />
        </>
    )
}