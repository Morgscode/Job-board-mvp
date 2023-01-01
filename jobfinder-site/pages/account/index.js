import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Account() {
  const user = useSelector((state) => state.auth.loggedInUser);
  console.log(user);
  return <h1>Welcome {user.email}</h1>;
}
