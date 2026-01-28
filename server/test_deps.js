try {
  require('dotenv').config();
  console.log('dotenv ok');
  require('express');
  console.log('express ok');
  require('mongoose');
  console.log('mongoose ok');
  require('uuid');
  console.log('uuid ok');
} catch (e) {
  console.error(e);
}
