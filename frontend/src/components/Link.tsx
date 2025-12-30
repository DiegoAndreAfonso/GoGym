
import { Text } from 'react-native-paper';


type props={
 titulo:string
}
const Link = ({titulo}:props) => {
    return <Text>{titulo}</Text>;
};


import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default Link;