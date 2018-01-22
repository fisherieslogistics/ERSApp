import colors from './darkColors';

export default {
   master: {
     backgroundColor: colors.backgrounds.veryDark,
     flexDirection: 'row',
     height: 95,
     flex: 1,
   },
   inner:{
     alignSelf: 'stretch',
     flex: 1,
     alignItems: 'center'
   },
   detail:{
     backgroundColor: colors.backgrounds.veryDark,
     flexDirection: 'row',
     flex: 0.1,
     height: 95,
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.30,
     alignItems: 'flex-end'
   },
   detailCenter: {
     paddingTop: 10,
     flex: 0.70,
     alignItems: 'flex-start',
   },
   textButton: {
     marginTop: 34,
     marginRight: 15,
     marginLeft: 22,
     width: 100,
   }
};
