import React, { useContext } from 'react'
import { Button, Platform, StyleSheet, Text, View } from 'react-native'
import { check, PERMISSIONS, PermissionStatus, request } from 'react-native-permissions'
import { BlackButton } from '../components/BlackButton'
import { PermissionsContext } from '../context/PermissionsContext'

export const PermissionsScreen = () => {

    const { permissions, askLocationPermission } = useContext(PermissionsContext)

    return (
        <View style={style.container}>
            <Text style={style.title}>Es necesario el uso del GPS para usar esta aplicación</Text>
            <BlackButton 
                title="Permiso"
                onPress={askLocationPermission}
            />
            <Text style={{marginTop: 20}}>
                {JSON.stringify(permissions, null, 5)}
            </Text>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        width: 200,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20
    }
})