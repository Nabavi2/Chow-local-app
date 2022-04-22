const Initial_State = {
  phone: null,
  token: null,
  guestToken: null,
  userInfo: null,
  printAsText: false,
  autoPrinterEnable: true,
  selectedPrinterAddress: null,
};

const reducer = (state = Initial_State, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload.token };

    case 'SET_GUEST_TOKEN':
      return { ...state, guestToken: action.payload.token };

    case 'SET_USERINFO':
      return {
        ...state,
        userInfo: { ...state.userInfo, ...action.payload.userInfo },
      };

    case 'SIGN_OUT':
      return {
        ...state,
        token: null,
        guestToken: null,
        userInfo: null,
      };

    case 'SET_PHONE':
      return {
        ...state,
        phone: action.payload.phone,
      };
    case 'SET_AUTOPRINT':
      return {
        ...state,
        autoPrinterEnable: action.payload.autoprint,
      };

    case 'SET_SELECTEDPRINTERADDRESS':
      return {
        ...state,
        selectedPrinterAddress: action.payload.address,
      };
    case 'SET_PRINTASTEXT':
      return {
        ...state,
        printAsText: action.payload.printAsText,
      };
  }

  return state;
};

export default reducer;
