'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserProfile, saveUserProfile } from '@/app/actions/user';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Profile() {
  const { id } = useParams();
  const [mode, setMode] = useState<'VIEW' | 'EDIT'>('VIEW');
  const [user, setUser] = useState<{
    id: string;
    name: string;
    photo: string;
    email: string;
    designation: string;
    bio: string;
  } | null>(null);
  const [loadedUser, setLoadedUser] = useState(null);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    getUserProfile(id as string).then(async (data) => {
      setUser(data.data);
      setLoadedUser(data.data);
    });
  }, [id]);

  const saveChanges = async () => {
    if (user) {
      const response = await saveUserProfile(user);
      console.log('REsponse : ', response);
    }
    setMode('VIEW');
  };

  return (
    <>
      {user == null ? (
        <p>Loading ...</p>
      ) : (
        <div className="h-full overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative  h-25 md:h-65">
            <Image
              src={'/images/cover-01.png'}
              alt="profile cover"
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              width={970}
              height={260}
            />
            <div className="absolute bottom-[-20] right-2  z-50">
              {/* <CiEdit className="text-2xl mt-4 mr-4 h-full" /> */}
              <Button
                className="mt-4 mr-4 h-full"
                variant={mode == 'EDIT' ? 'default' : 'outline'}
                onClick={async () => {
                  if (mode == 'EDIT') {
                    await saveChanges();
                  } else {
                    setMode('EDIT');
                  }
                }}
              >
                {mode == 'EDIT' ? 'Save Changes' : 'Edit'}
              </Button>
              {mode == 'EDIT' && (
                <Button
                  className="mt-4 mr-4 h-full"
                  variant={'destructive'}
                  onClick={() => {
                    setMode('VIEW');
                    if (changed) {
                      setChanged(false);
                      setUser(loadedUser);
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5 relative">
            <div className="relative z-30 mx-auto -mt-24 h-30 w-full max-w-30 rounded-full  sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2 ">
                <Image
                  className="rounded-full"
                  src={'/images/user-01.png'}
                  width={160}
                  height={160}
                  alt="profile"
                />
                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                >
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                      fill=""
                    />
                  </svg>
                  <input
                    type="file"
                    name="profile"
                    id="profile"
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 ">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {/* {user.name} */}
                <input
                  type="text"
                  placeholder={user.name || 'Enter your name'}
                  className={cn(
                    'text-xl outline-0 p-1 rounded-sm text-center w-full',
                    mode == 'EDIT'
                      ? 'border border-gray-100 min-w-20'
                      : 'bg-transparent'
                  )}
                  value={user.name}
                  onChange={(e) => {
                    setChanged(true);
                    setUser({
                      ...user,
                      name: e.target.value || '',
                    });
                  }}
                  disabled={mode == 'VIEW'}
                />
              </h3>

              {/* {user.designation || 'Enter your designation'} */}
              <input
                type="text"
                placeholder={
                  user.designation || mode == 'EDIT'
                    ? 'Enter your designation'
                    : '...'
                }
                className={cn(
                  'text-sm outline-0 p-1 rounded-sm text-center w-full mt-3',
                  mode == 'EDIT'
                    ? 'border border-gray-100  min-w-20'
                    : 'bg-transparent'
                )}
                value={user.designation}
                onChange={(e) => {
                  setChanged(true);
                  setUser({
                    ...user,
                    designation: e.target.value || '',
                  });
                }}
                disabled={mode == 'VIEW'}
              />

              <div className="mx-auto mb-5.5 mt-6 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    0
                  </span>
                  <span className="text-sm">Calls</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    0
                  </span>
                  <span className="text-sm">Followers</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    0
                  </span>
                  <span className="text-sm">Favorites</span>
                </div>
              </div>

              <div className="mx-auto max-w-180 mt-6">
                <h4 className="font-semibold text-black dark:text-white">
                  About Me
                </h4>
                {/* <p className="mt-4.5">{user.bio || 'Enter your description'}</p> */}
                <textarea
                  // type="text"
                  placeholder={
                    user.bio || mode == 'EDIT'
                      ? 'Enter your description'
                      : '...'
                  }
                  className={cn(
                    'font-normal  text-lg outline-0 p-1 rounded-sm text-center w-full',
                    mode == 'EDIT'
                      ? 'border border-gray-100 w-full'
                      : 'bg-transparent resize-none'
                  )}
                  value={user.bio}
                  onChange={(e) => {
                    setChanged(true);
                    setUser({
                      ...user,
                      bio: e.target.value || '',
                    });
                  }}
                  disabled={mode == 'VIEW'}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
