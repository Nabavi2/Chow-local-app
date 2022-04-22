import {Config} from '~/core/config';

export const formatPhoneNumber = e => {
  const cleaned = ('' + e).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return '+' + cleaned;
};

export const isEmptyString = text => {
  return text === null || text.match(/^ *$/) !== null;
};

export const formatString = (str, length) =>
  str && (str.length <= length ? str : str.substr(0, length) + '...');

export const fetchAPI = (url, options) => {
  return fetch(`${Config.apiBaseURL}${url}`, options)
    .then(async res => {
      console.log(res.status);
      if (res.status >= 200 && res.status <= 300) {
        return res;
      } else {
        let json = await res.json();

        throw Error(json.message);
      }
    })
    .then(res => res.json())
    .then(res => {
      return res;
    });
};

export const formatCCExpiry = str => {
  const temp = str.replace(/ /g, '');
  if (temp) {
    if (temp.includes('/')) {
      const arr = temp.split('/');
      if (arr[1] !== '') {
        return `${arr[0]} / ${arr[1]}`;
      }
    } else if (temp.length > 2) {
      return `${temp.substr(0, 2)} / ${str.substr(2)}`;
    }
  }
  return str;
};

export const formatCategoryString = (territory, category) => {
  const params = {
    territory: territory,
    category: category,
  };
  return Object.keys(params)
    .filter(k => params[k] !== null)
    .map(k => params[k])
    .join(' - ');
};

export const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const renderHTML = htmlString => {
  var stripedHtml = htmlString.replace(/<[^>]+>/g, '');

  return stripedHtml;
};

const pluralizeTime = (val, string) => {
  return val + ' ' + string + (val > 1 && 's') + ' Ago';
};

export const getTimePassed = (pastDate, futureDate = new Date()) => {
  if (typeof pastDate === 'string') pastDate = pastDate.replaceAll('-', '/');

  pastDate = new Date(Date.parse(pastDate + '-06:00'));

  let seconds = Math.floor((futureDate - pastDate) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  if (days > 0) {
    return pluralizeTime(days, 'Day');
  } else if (hours > 0) {
    return pluralizeTime(hours, 'Hr');
  } else if (minutes > 0) {
    return pluralizeTime(minutes, 'Min');
  } else if (seconds > 0) {
    return pluralizeTime(seconds, 'Sec');
  } else {
    return null;
  }
};

export const truncateAddress = addressString => {
  if (typeof addressString == 'string') {
    const addressObj = addressString.split(',');
    return addressObj[0];
  } else {
    return addressString;
  }
};
var Sound = require('react-native-sound');
export const playSound = mode => {
  Sound.setCategory('Playback');
  if (mode == 'order') {
    var whoosh = new Sound('alert.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          whoosh.getDuration() +
          'number of channels: ' +
          whoosh.getNumberOfChannels(),
      );
      // Play the sound with an onEnd callback
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing @@@@-new order');
          whoosh.release();
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  } else {
    var whoosh = new Sound('message.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          whoosh.getDuration() +
          'number of channels: ' +
          whoosh.getNumberOfChannels(),
      );
      // Play the sound with an onEnd callback
      whoosh.play(success => {
        if (success) {
          console.log('successfully finished playing @@@@-new message');
          whoosh.release();
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  }
};

export const getTimeLeft = date => {
  var currrentDateString = new Date().toLocaleString('sv-SE', {
    timeZone: 'America/Regina',
  });
  console.log('$$$$$%%%%%%', currrentDateString);
  if (date && date != '') {
    var d = new Date(date.replace(' ', 'T'));
    var s = new Date(currrentDateString.replace(' ', 'T'));
    var seconds = Math.floor((s - d) / 1000);
    console.log('########', seconds);
    var interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval);
    } else {
      return Math.floor(interval);
    }
    return '0';
  }
};

export const getTimeAgo = date => {
  var currrentDateString = new Date().toLocaleString('sv-SE', {
    timeZone: 'America/Regina',
  });
  if (date && date != '') {
    var d = new Date(date.replace(' ', 'T'));
    var s = new Date(currrentDateString.replace(' ', 'T'));
    var seconds = Math.floor((s - d) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' year ago';
      } else {
        return Math.floor(interval) + ' years ago';
      }
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' month ago';
      } else {
        return Math.floor(interval) + ' months ago';
      }
    }
    interval = seconds / 86400;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' day ago';
      } else {
        return Math.floor(interval) + ' days ago';
      }
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' hour ago';
      } else {
        return Math.floor(interval) + ' hours ago';
      }
    }
    interval = seconds / 60;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' min ago';
      } else {
        return Math.floor(interval) + ' mins ago';
      }
    }
    return Math.floor(seconds) + ' sec ago';
  }
};

export const getTimeAway = date => {
  var currrentDateString = new Date().toLocaleString('sv-SE', {
    timeZone: 'America/Regina',
  });
  if (date && date != '') {
    var d = new Date(date.replace(' ', 'T'));
    var s = new Date(currrentDateString.replace(' ', 'T'));
    var seconds = Math.floor((d - s) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' year away';
      } else {
        return Math.floor(interval) + ' years away';
      }
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' month away';
      } else {
        return Math.floor(interval) + ' months away';
      }
    }
    interval = seconds / 86400;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' day away';
      } else {
        return Math.floor(interval) + ' days away';
      }
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' hr away';
      } else {
        return Math.floor(interval) + ' hrs away';
      }
    }
    interval = seconds / 60;
    if (interval > 1) {
      if (Math.floor(interval) == 1) {
        return Math.floor(interval) + ' min away';
      } else {
        return Math.floor(interval) + ' mins away';
      }
    }
    return Math.floor(seconds) + ' sec away';
  }
};
