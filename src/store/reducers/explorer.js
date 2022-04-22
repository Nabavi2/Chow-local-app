const InitialState = {
  address: null,
  territory: null,
  addressFull: null,
};

const reducer = (state = InitialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload.address,
      };

    case 'SET_ADDRESS_FULL':
      return {
        ...state,
        addressFull: action.payload.addressFull,
      };

    case 'SET_TERRITORY':
      return {
        ...state,
        territory: action.payload.territory,
      };
  }
  return state;
};

export default reducer;
