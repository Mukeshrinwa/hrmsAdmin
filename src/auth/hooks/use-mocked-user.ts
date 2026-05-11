// import { _mock } from 'src/_mock';

// // To get the user from the <AuthContext/>, you can use

// // Change:
// // import { useMockedUser } from 'src/auth/hooks';
// // const { user } = useMockedUser();

// // To:
// // import { useAuthContext } from 'src/auth/hooks';
// // const { user } = useAuthContext();

// // ----------------------------------------------------------------------

// export function useMockedUser() {
//   const user = {
//     id: '8864c717-587d-472a-929a-8e5f298024da-0',
//     displayName: 'Jaydon Frankie',
//     email: 'demo@minimals.cc',
//     photoURL: _mock.image.avatar(24),
//     phoneNumber: _mock.phoneNumber(1),
//     country: _mock.countryNames(1),
//     address: '90210 Broadway Blvd',
//     state: 'California',
//     city: 'San Francisco',
//     zipCode: '94116',
//     about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
//     role: 'admin',
//     isPublic: true,
//   };

//   return { user };
// }




import { useState, useEffect } from 'react';

import { _mock } from 'src/_mock';
import useUpdatePasswordApi from 'src/Api/passUpdate/updatepasswordApi';

// ----------------------------------------------------------------------

export function useMockedUser() {
  const { meApi } = useUpdatePasswordApi();
  const [user, setUser] = useState({
    id: '',
    displayName: '',
    email: '',
    photoURL: _mock.image.avatar(24),
    phoneNumber: '',
    country: '',
    address: '',
    state: '',
    city: '',
    zipCode: '',
    about: '',
    role: '',
    isPublic: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await meApi();
        if (response && response.user) {
          const apiUser = response.user;
          setUser({
            id: apiUser._id || '',
            displayName: apiUser.username || '',
            email: '',
            photoURL: _mock.image.avatar(24),
            phoneNumber: apiUser.mobile || '',
            country: '',
            address: '',
            state: '',
            city: '',
            zipCode: '',
            about: '',
            role: apiUser.roles?.[0] || '',
            isPublic: true,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user };
}