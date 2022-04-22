// Notification Actions

export const showNotification = ({
  type,
  title,
  message,
  options,
  autoHide,
  buttonText,
  buttonAction,
}) => ({
  type: 'SHOW_NOTIFICATION',
  payload: {
    type: type || null,
    title: title || null,
    message: message || null,
    options: options || {},
    autoHide:
      typeof autoHide != 'undefined'
        ? autoHide
        : type && ['success', 'error'].indexOf(type) > -1
        ? false
        : true,
    buttonText: typeof buttonText != 'undefined' ? buttonText : false,
    buttonAction: typeof buttonAction != 'undefined' ? buttonAction : false,
  },
});

export const clearNotification = () => ({
  type: 'CLEAR_NOTIFICATION',
});

export const updatedInstructions = instructions => ({
  type: 'UPDATED_INSTRUCTIONS',
  payload: {
    instructions: instructions,
  },
});

export const updatedETA = ETA => ({
  type: 'UPDATED_ETA',
  payload: {
    ETATime: ETA,
  },
});

export const updatedNotes = notes => ({
  type: 'UPDATED_ORDERNOTE',
  payload: {
    notes: notes,
  },
});

export const updatePromoCode = promocode => ({
  type: 'UPDATED_PROMOCODE',
  payload: {
    promocode: promocode,
  },
});

export const subscriptionAddressUpdated = subscriptionAddressUpdated => ({
  type: 'UPDATED_SUBSCRIPTIONADDRESS',
  payload: {
    subscriptionAddressUpdated: subscriptionAddressUpdated,
  },
});
export const subscriptionCancelled = subscriptionCancelledUpdated => ({
  type: 'UPDATED_SUBSCRIPTIONCANCELLED',
  payload: {
    subscriptionCancelledUpdated: subscriptionCancelledUpdated,
  },
});

export const setAddedReview = review => ({
  type: 'UPDATED_REVIEW',
  payload: {
    review: review,
  },
});

export const setDescriptionUpdatedGuest = resetMode => ({
  type: 'UPDATED_DESCRIPTIONGUEST',
  payload: {
    descriptionGuest: resetMode,
  },
});

export const enterMessageRoom = entered => ({
  type: 'ENTER_MESSAGEROOM',
  payload: {
    enterMessageRoom: entered,
  },
});
// Account

export const setPhone = phone => ({
  type: 'SET_PHONE',
  payload: {
    phone,
  },
});

export const setToken = token => ({
  type: 'SET_TOKEN',
  payload: {
    token,
  },
});

export const setGuestToken = token => ({
  type: 'SET_GUEST_TOKEN',
  payload: {
    token,
  },
});

export const setUserInfo = userInfo => {
  return {
    type: 'SET_USERINFO',
    payload: {
      userInfo,
    },
  };
};

export const signOut = () => ({
  type: 'SIGN_OUT',
});

// Order
export const setOrder = order => ({
  type: 'SET_ORDER',
  payload: {
    order,
  },
});

export const clearOrder = () => ({
  type: 'CLEAR_ORDER',
});

export const cancelOrder = () => ({
  type: 'CANCEL_ORDER',
});

export const setOrderProduct = orderProduct => ({
  type: 'SET_ORDERPRODUCT',
  payload: {
    orderProduct,
  },
});

export const setPastOrders = pastOrders => ({
  type: 'SET_PASTORDERS',
  payload: {
    pastOrders,
  },
});

export const setMessageTerritories = messageTerritories => ({
  type: 'SET_MESSAGETERRITORIES',
  payload: {
    messageTerritories,
  },
});

// Exploring
export const setAddress = address => ({
  type: 'SET_ADDRESS',
  payload: {
    address,
  },
});

export const updateCard = isUpdateCard => ({
  type: 'UPDATE_CARD',
  payload: {
    isUpdateCard,
  },
});

export const updateStatus = status_slug => ({
  type: 'UPDATE_STATUS',
  payload: {
    status_slug,
  },
});

export const isUpdateStatus = updated => ({
  type: 'IS_UPDATE_STATUS',
  payload: {
    updated,
  },
});

export const setAddressFull = addressFull => ({
  type: 'SET_ADDRESS_FULL',
  payload: {
    addressFull,
  },
});

export const setTerritory = territory => ({
  type: 'SET_TERRITORY',
  payload: {
    territory,
  },
});

export const setTerritoryType = territory_type => ({
  type: 'SET_TERRITORY_TYPE',
  payload: {
    territory_type,
  },
});

export const setUnreadMsgCnt = count => ({
  type: 'SET_UNREAD_MSG_CNT',
  payload: {
    count,
  },
});

export const setNewOrdersCnt = count => ({
  type: 'SET_NEW_ORDERS_CNT',
  payload: {
    count,
  },
});

export const setPreOrdersCnt = count => ({
  type: 'SET_PRE_ORDERS_CNT',
  payload: {
    count,
  },
});

export const setAutoPrinterEnable = autoprint => ({
  type: 'SET_AUTOPRINT',
  payload: {
    autoprint,
  },
});

export const setSelectedPrinterAddress = address => ({
  type: 'SET_SELECTEDPRINTERADDRESS',
  payload: {
    address,
  },
});

export const setPrintAsText = printAsText => ({
  type: 'SET_PRINTASTEXT',
  payload: {
    printAsText,
  },
});
