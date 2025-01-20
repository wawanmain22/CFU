import StaffLayout from "@/Layouts/StaffLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AlertSuccess from "@/Components/AlertSuccess";
import AlertError from "@/Components/AlertError";
import { PageProps } from "@/types";
import { UserCog, Phone, MapPin, Lock, Building2, Briefcase, Users2, Calendar, Book, User, Mail, Hash, Clock, History, Eye, EyeOff } from "lucide-react";

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
    error?: string;
  };
}

export default function ProfilePage({ auth, flash }: Props) {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (flash.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
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

  const labelClassName = "text-gray-400 flex items-center gap-2";
  const valueClassName = "text-white";
  const inputClassName = "w-full rounded bg-gray-800 border-gray-700 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm";
  const buttonPrimaryClassName = "px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-500 disabled:opacity-50 shadow-sm";
  const buttonSecondaryClassName = "px-3 py-2 border border-gray-600 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700 disabled:opacity-50 shadow-sm";
  const editLinkClassName = "text-indigo-400 text-sm hover:text-indigo-300 hover:underline font-medium";

  const handleSavePhone = () => {
    updatePhone('/staff/profile/phone', {
      onSuccess: () => {
        setIsEditingPhone(false);
      },
      onError: (errors: any) => {
        setErrorMessage(errors.phone || 'Failed to update phone number');
        setShowError(true);
      },
    });
  };

  const handleSaveAddress = () => {
    updateAddress('/staff/profile/address', {
      onSuccess: () => {
        setIsEditingAddress(false);
      },
      onError: (errors: any) => {
        setErrorMessage(errors.address || 'Failed to update address');
        setShowError(true);
      },
    });
  };

  const handleSavePassword = () => {
    setPasswordError(null);
    setShowError(false);

    // Validate password length
    if (passwordData.new_password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      setErrorMessage('Password must be at least 8 characters long');
      setShowError(true);
      return;
    }

    // Check if passwords match
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordError('New password and confirmation password do not match');
      setErrorMessage('New password and confirmation password do not match');
      setShowError(true);
      return;
    }

    updatePassword('/staff/profile/password', {
      onSuccess: () => {
        setIsEditingPassword(false);
        resetPassword();
        setPasswordError(null);
      },
      onError: (errors: any) => {
        if (errors.current_password) {
          setErrorMessage(errors.current_password);
          setShowError(true);
        }
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

      {showError && (
        <AlertError 
          message={errorMessage} 
          onClose={() => setShowError(false)} 
        />
      )}

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 border-b border-gray-700 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <UserCog className="w-8 h-8 text-indigo-500" />
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          </div>
          <p className="text-gray-400">Manage your personal information and account settings</p>
        </div>

        <div className="space-y-8 bg-gray-900/50 p-6 rounded-lg border border-gray-800">
          <div className="space-y-6">
            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><User className="w-4 h-4" /> Full Name</span>
              <span className={valueClassName}>{auth.user.name}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Mail className="w-4 h-4" /> Email</span>
              <span className={valueClassName}>{auth.user.email}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Phone className="w-4 h-4" /> Phone</span>
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
              <span className={labelClassName}><MapPin className="w-4 h-4" /> Address</span>
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
              <span className={labelClassName}><Users2 className="w-4 h-4" /> Gender</span>
              <span className={valueClassName}>{auth.user.gender === 'male' ? 'Pria' : auth.user.gender === 'female' ? 'Wanita' : '-'}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Book className="w-4 h-4" /> Religion</span>
              <span className={valueClassName}>{auth.user.religion || '-'}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Calendar className="w-4 h-4" /> Birthdate</span>
              <span className={valueClassName}>
                {auth.user.birthdate ? new Date(auth.user.birthdate).toLocaleDateString() : '-'}
              </span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Hash className="w-4 h-4" /> Employee ID</span>
              <span className={valueClassName}>{auth.staff.employee_id}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Briefcase className="w-4 h-4" /> Position</span>
              <span className={valueClassName}>{auth.staff.position}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Building2 className="w-4 h-4" /> Department</span>
              <span className={valueClassName}>{auth.staff.department}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><Users2 className="w-4 h-4" /> Role</span>
              <span className={`${valueClassName} capitalize`}>{auth.user.role}</span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-start">
              <span className={labelClassName}><Lock className="w-4 h-4" /> Password</span>
              {isEditingPassword ? (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData('current_password', e.target.value)}
                      className={`${inputClassName} pr-10`}
                      placeholder="Current Password"
                      disabled={processingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.new_password}
                      onChange={(e) => {
                        setPasswordData('new_password', e.target.value);
                        setPasswordError(null); // Clear error when user types
                      }}
                      className={`${inputClassName} pr-10`}
                      placeholder="New Password"
                      disabled={processingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => {
                        setPasswordData('new_password_confirmation', e.target.value);
                        setPasswordError(null); // Clear error when user types
                      }}
                      className={`${inputClassName} pr-10`}
                      placeholder="Confirm New Password"
                      disabled={processingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Add error message display */}
                  {passwordError && (
                    <div className="text-red-500 text-sm">
                      {passwordError}
                    </div>
                  )}

                  <div className="flex gap-2">
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
                        setPasswordError(null); // Clear error when canceling
                      }}
                      disabled={processingPassword}
                      className={buttonSecondaryClassName}
                    >
                      Cancel
                    </button>
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
              <span className={labelClassName}><Clock className="w-4 h-4" /> Akun Dibuat</span>
              <span className={valueClassName}>
                {auth.user.created_at ? new Date(auth.user.created_at).toLocaleString() : '-'}
              </span>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-x-4 items-center">
              <span className={labelClassName}><History className="w-4 h-4" /> Akun Diperbarui</span>
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
