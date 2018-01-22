import colors from './darkColors';

export default {
  wrapper: {
    alignSelf: 'stretch',
    flex: 1,
    marginTop: 2,
  },
  innerWrapper: {
    paddingBottom: 2,
  },
  col:{
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
  },
  singleInput: {
    margin: 4,
    height: 55,
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  labelRow: {
    height: 22,
  },
  labelText: {
    color: colors.green,
    fontSize: 17,
  },
  activeText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  labelError: {
    fontSize: 17,
    color: colors.orange
  },
  errorDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.orange,
    borderRadius: 5,
    margin: 4,
  },
  inputRow: {
    alignSelf: 'stretch',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightestGray
  },
}
