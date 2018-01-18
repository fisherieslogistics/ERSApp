import colors from './darkColors';

export default {
  dateText: {
    fontSize: 18,
    flex: 1,
    color: colors.green,
    textAlign: 'left'
  },
  textInput: {
    fontSize: 18,
    flex: 1,
    height: 28,
    color: colors.white,
    marginTop: 8,
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
    height: 27,
    flex: 1,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  dateInputInvisible: {
    height: 0,
    width: 0,
    opacity: 0,
  },
  label:{
    fontWeight: "500",
    color: "#b0b0b0",
    fontSize: 19,
  }
}
