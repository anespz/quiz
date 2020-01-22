import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    card: {
        backgroundColor: 'white', flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '50px',
        paddingBottom: '50px',
        marginHorizontal: '50px',
        width: '80%',
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
        padding: '10px'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '10px',
        paddingBottom: '10px',
    }, 
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        padding: '10px'
    }, 
    listelement: {
        fontSize: 15,
        textAlign: 'center',
        padding: '10px'
    },
    buttonview: {
        flexDirection: 'row',
    }, 
    table: {
        padding: '10px',
        textAlign: 'center',
        flexDirection: 'col'
    },
    row: {
        padding: '10px',
        borderWidth: '1px',
        borderColor: '#f4f4f4',
        flexDirection: 'row'
    }, 
    cell: {
        padding: '10px',
        border: '1px',
        borderColor: '#f4f4f4'
    }

});