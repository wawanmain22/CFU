import StaffLayout from "@/Layouts/StaffLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AlertSuccess from "@/Components/AlertSuccess";
import { PageProps } from "@/types";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  religion: string | null;
  birthdate: string | null;
  address: string | null;
  role: string;
  created_at: string | null;
  updated_at: string | null;
}

interface Staff {
  employee_id: string;
  position: string;
  department: string;
}

interface Props extends PageProps {
  auth: {
    user: User;
    staff: Staff;
  };
  flash: {
    success?: string;
  };
}

export default function ProfilePage({ auth, flash }: Props) {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (flash.success) {
      setShowSuccess(true);
    }
  }, [flash.success]);

  const { data: phoneData, setData: setPhoneData, patch: updatePhone, processing: processingPhone } = useForm({
    phone: auth.user.phone || '',
  });

  const { data: addressData, setData: setAddressData, patch: updateAddress, processing: processingAddress } = useForm({
    address: auth.user.address || '',
  });

  const { data: passwordData, setData: setPasswordData, patch: updatePassword, processing: processingPassword, reset: resetPassword } = useForm({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const labelClassName = "text-gray-400";
  const valueClassName = "text-white";
  const inputClassName = "flex-1 rounded bg-gray-800 border-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm";
  const buttonPrimaryClassName = "px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 disabled:opacity-50 shadow-sm";
  const buttonSecondaryClassName = "px-3 py-2 border border-gray-600 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 shadow-sm";
  const editLinkClassName = "text-indigo-400 text-sm hover:text-indigo-300 hover:underline font-medium";

  const handleSavePhone = () => {
    updatePhone('/staff/profile/phone', {
      onSuccess: () => {
        setIsEditingPhone(false);
      },
      onError: () => {
        // Handle error
      },
    });
  };

  const handleSaveAddress = () => {
    updateAddress('/staff/profile/address', {
      onSuccess: () => {
        setIsEditingAddress(false);
      },
      onError: () => {
        // Handle error
      },
    });
  };

  const handleSavePassword = () => {
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      return;
    }

    updatePassword('/staff/profile/password', {
      onSuccess: () => {
        setIsEditingPassword(false);
        resetPassword();
      },
      onError: (errors) => {
        // Handle error
      },
    });
  };

  return (
    <StaffLayout user={auth.user}>
      <Head title="Profile Settings" />
      
      {showSuccess && flash.success && (
        <AlertSuccess 
          message={flash.success} 
          onClose={() => setShowSuccess(false)} 
        />
      )}

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Profile Info */}
          <div className="space-y-6">
            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Full Name</span>
              <span className={valueClassName}>{auth.user.name}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Email</span>
              <span className={valueClassName}>{auth.user.email}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Phone</span>
              {isEditingPhone ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={phoneData.phone}
                    onChange={(e) => setPhoneData('phone', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter phone number"
                    disabled={processingPhone}
                  />
                  <button
                    onClick={handleSavePhone}
                    disabled={processingPhone}
                    className={buttonPrimaryClassName}
                  >
                    {processingPhone ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPhone(false);
                      setPhoneData('phone', auth.user.phone || '');
                    }}
                    disabled={processingPhone}
                    className={buttonSecondaryClassName}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={valueClassName}>{auth.user.phone || '-'}</span>
                  <button
                    onClick={() => setIsEditingPhone(true)}
                    className={editLinkClassName}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Address</span>
              {isEditingAddress ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addressData.address}
                    onChange={(e) => setAddressData('address', e.target.value)}
                    className={inputClassName}
                    placeholder="Enter address"
                    disabled={processingAddress}
                  />
                  <button
                    onClick={handleSaveAddress}
                    disabled={processingAddress}
                    className={buttonPrimaryClassName}
                  >
                    {processingAddress ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingAddress(false);
                      setAddressData('address', auth.user.address || '');
                    }}
                    disabled={processingAddress}
                    className={buttonSecondaryClassName}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={valueClassName}>{auth.user.address || '-'}</span>
                  <button
                    onClick={() => setIsEditingAddress(true)}
                    className={editLinkClassName}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Gender</span>
              <span className={valueClassName}>{auth.user.gender === 'male' ? 'Pria' : auth.user.gender === 'female' ? 'Wanita' : '-'}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Religion</span>
              <span className={valueClassName}>{auth.user.religion || '-'}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Birthdate</span>
              <span className={valueClassName}>
                {auth.user.birthdate ? new Date(auth.user.birthdate).toLocaleDateString() : '-'}
              </span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Employee ID</span>
              <span className={valueClassName}>{auth.staff.employee_id}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Position</span>
              <span className={valueClassName}>{auth.staff.position}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Department</span>
              <span className={valueClassName}>{auth.staff.department}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Role</span>
              <span className={`${valueClassName} capitalize`}>{auth.user.role}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Password</span>
              {isEditingPassword ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                        className={inputClassName}
                        placeholder="Current Password"
                        disabled={processingPassword}
                      />
                      <input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData('new_password', e.target.value)}
                        className={inputClassName}
                        placeholder="New Password"
                        disabled={processingPassword}
                      />
                      <input
                        type="password"
                        value={passwordData.new_password_confirmation}
                        onChange={(e) => setPasswordData('new_password_confirmation', e.target.value)}
                        className={inputClassName}
                        placeholder="Confirm New Password"
                        disabled={processingPassword}
                      />
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                      <button
                        onClick={handleSavePassword}
                        disabled={processingPassword}
                        className={buttonPrimaryClassName}
                      >
                        {processingPassword ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPassword(false);
                          resetPassword();
                        }}
                        disabled={processingPassword}
                        className={buttonSecondaryClassName}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className={editLinkClassName}
                >
                  Change Password
                </button>
              )}
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Akun Dibuat</span>
              <span className={valueClassName}>
                {auth.user.created_at ? new Date(auth.user.created_at).toLocaleString() : '-'}
              </span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}>Akun Diperbarui</span>
              <span className={valueClassName}>
                {auth.user.updated_at ? new Date(auth.user.updated_at).toLocaleString() : 'Belum Pernah'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
