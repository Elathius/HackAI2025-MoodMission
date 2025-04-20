import { View, Text } from './Themed';
import CourseButton from './CourseButton'
import { StyleSheet } from 'react-native';

type Properties = {
  id: string, 
  name: string, 
  addedStyles:{}, 
  reverse?: boolean
}

export default function CourseLevelLabel({id, name, addedStyles, reverse=false} : Properties) {
    return (
        <View style={[styles.container, addedStyles]}>
          {reverse ?
          <>
            <Text style={styles.message}>{name}</Text>
            <CourseButton id={id}/>
          </> :
          <>
            <CourseButton id={id}/>
            <Text style={styles.message}>{name}</Text>
          </>
          }
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      marginInline: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: 'transparent',
    },
    circle: {
      width: 40,
      height: 40,
      borderRadius: 24, // makes it a circle
      backgroundColor: '#4F46E5', // indigo or whatever you prefer
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    circleReversed: {
      width: 40,
      height: 40,
      borderRadius: 24, // makes it a circle
      backgroundColor: '#4F46E5', // indigo or whatever you prefer
      justifyContent: 'center',
      alignItems: 'center',
    },
    idText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    message: {
      fontSize: 16,
      color: '#333',
      flexShrink: 1,
      textAlign: 'center',
      width: '80%',
    },
    messageReversed: {
      fontSize: 16,
      color: '#333',
      flexShrink: 1,
      textAlign: 'center',
      width: '70%',
      marginRight: 12,
    }
  });