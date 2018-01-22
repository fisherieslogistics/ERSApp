import colors from './darkColors';

export default {
  dateText: {
    fontSize: 18,
    flex: 1,
    color: colors.white,
    textAlign: 'left'
  },
  textInput: {
    fontSize: 22,
    flex: 1,
    color: colors.white,
    height: 36,
    marginTop: 5,
  },
  locationContainer: {
    backgroundColor: colors.backgrounds.dark,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateIcon: {
    height: 0,
    opacity: 0,
  },
  dateInput: {
    borderWidth: 0,
    width: 200,
    flex: 1,
  },
  dateInputInvisible: {
    height: 0,
    width: 0,
    opacity: 0,
  },
  label:{
    fontWeight: "500",
    color: "#b0b0b0",
    fontSize: 20,
  }
}
