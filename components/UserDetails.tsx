"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";
import { User } from "@/types/user";
import UpdateProfileDialog from "./UpdateProfileDialog";

interface UserDetailsProps {
  user: User;
}

const getInitials = (name: string) => name?.charAt(0).toUpperCase() || "?";

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <div className="p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-linear-to-tr from-amber-400 to-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <Avatar className="h-24 w-24 border-4 border-white shadow-xl relative">
                <AvatarImage
                  src={user.profilePhoto}
                  alt={user.fullname}
                  className="object-cover"
                />
                <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl font-bold">
                  {getInitials(user.fullname)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {user.fullname}
              </h1>
              <p className="text-gray-500 font-medium max-w-md line-clamp-2">
                {user.profileBio || "No bio added yet. Tell us about yourself!"}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  <span>{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Contact className="h-3.5 w-3.5 text-amber-500" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl bg-gray-50 text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all border border-gray-100 cursor-pointer"
            onClick={() => setOpen(true)}
            aria-label="Edit profile"
          >
            <Pen className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 border-t border-gray-50 pt-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Briefcase className="h-4 w-4" /> Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {user.profileSkills?.length ? (
              user.profileSkills.map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-700 font-medium py-1.5 px-3.5 transition-colors shadow-sm"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 italic text-sm">
                Add skills to showcase your talent
              </span>
            )}
          </div>
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} user={user} />
    </div>
  );
};

export default UserDetails;
