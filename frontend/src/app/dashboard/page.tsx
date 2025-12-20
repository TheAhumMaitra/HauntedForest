"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { OrganizationSwitcher, useAuth, useOrganization } from "@clerk/nextjs";
import { useState } from "react";

function AddPost() {
  return (
    <>
      <Alert variant="destructive" className="mt-6">
        <AlertTitle>Sorry, we are still building the app!</AlertTitle>
        <AlertDescription>
          Well, you can not create Posts for yet! Please wait for sometime, we
          are still building the app!
        </AlertDescription>
      </Alert>
    </>
  );
}
export default function Page() {
  // The `useAuth()` hook gives you access to properties like `isSignedIn` and `has()`
  const { isSignedIn, has } = useAuth();
  const { organization } = useOrganization();
  const [showAddPost, setShowAddPost] = useState(false);

  // Check if the user is authenticated
  if (!isSignedIn) {
    return (
      <div className="min-h-screen w-full">
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>You must be SignedIn to access the page!</AlertTitle>
          <AlertDescription>
            Sign In to access this page and you must be an admin to access this
            page
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check if there is an Active Organization
  if (!organization) {
    return (
      <>
        <p>Set an Active Organization to access this page.</p>
        <OrganizationSwitcher />
      </>
    );
  }

  // Check if the user has the `org:admin` Role
  if (!has({ role: "org:admin" })) {
    <div className="min-h-screen w-full">

    <Alert variant="destructive" className="mt-6">
      <AlertTitle>You must be an admin!</AlertTitle>
      <AlertDescription>
        You must be an admin to access this page, ACCESSES FORBIDDEN.
      </AlertDescription>
    </Alert>;
    </div>
  }

  // Check if Organization name matches (e.g., "Acme Corp")
  const requiredOrgName = "HauntedForest";
  if (organization.name !== requiredOrgName) {
    return (
      <>
        <p>
          This page is only accessible in the <strong>{requiredOrgName}</strong>{" "}
          Organization. Switch to the <strong>{requiredOrgName}</strong>{" "}
          Organization to access this page.
        </p>
        <OrganizationSwitcher />
      </>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
      <p>
        <button
          onClick={() => setShowAddPost(true)}
          className="bg-card p-3 rounded-full font-bold hover:bg-primary"
        >
          Create Post
        </button>
      </p>
      {showAddPost && <AddPost />}
    </main>
  );
}
