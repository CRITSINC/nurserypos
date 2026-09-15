"use client";

import { useState } from "react";

import {
  useBootstrapSyncMutation,
  useLazyAuthUrlQuery,
  useManualSyncMutation,
  useReadOnlyStatusQuery,
  useToggleReadOnlyMutation,
} from "@/redux/services/lightspeed";

import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Switch } from "@/components/admin/ui/switch";
import { Label } from "@/components/admin/ui/label";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog";

import {
  toasterError,
  toasterSuccess,
} from "@/components/core/Toaster";

export default function ManualActions() {
  const { data, isLoading } = useReadOnlyStatusQuery();

  const [manualSync, { isLoading: syncing }] =
    useManualSyncMutation();

  const [bootstrapSync, { isLoading: bootstrapping }] =
    useBootstrapSyncMutation();

  const [toggleReadOnly, { isLoading: toggling }] =
    useToggleReadOnlyMutation();

  const [getAuthUrl] = useLazyAuthUrlQuery();

  // Controls the confirmation dialog
  const [showReadOnlyAlert, setShowReadOnlyAlert] =
    useState(false);

  // Stores the action the user is about to perform
  // true  = enable
  // false = disable
  const [pendingReadOnly, setPendingReadOnly] =
    useState(false);

  /**
   * Run manual sync
   */
  const handleManualSync = async () => {
    try {
      const response = await manualSync().unwrap();

      toasterSuccess(response.data.message);
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
          err?.data?.message ??
          "Unable to start sync."
      );
    }
  };

  /**
   * Run bootstrap sync
   */
  const handleBootstrap = async () => {
    try {
      const response = await bootstrapSync().unwrap();

      toasterSuccess(response.data.message);
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
          err?.data?.message ??
          "Unable to start bootstrap."
      );
    }
  };

  /**
   * User clicked the Read-only Mode switch.
   *
   * We don't immediately call the API.
   * We first show a confirmation dialog.
   */
  const handleToggle = (checked: boolean) => {
    setPendingReadOnly(checked);
    setShowReadOnlyAlert(true);
  };

  /**
   * Confirm Read-only Mode change
   */
  const handleConfirmReadOnly = async () => {
    try {
      const response = await toggleReadOnly(
        pendingReadOnly
      ).unwrap();

      toasterSuccess(response.data.message);

      setShowReadOnlyAlert(false);
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
          err?.data?.message ??
          "Unable to update read-only mode."
      );
    }
  };

  /**
   * Connect / reconnect Lightspeed
   */
  const handleConnect = async () => {
    try {
      const response = await getAuthUrl().unwrap();

      window.open(
        response.data.authorizeUrl,
        "_blank"
      );
    } catch (err: any) {
      toasterError(
        err?.data?.error?.message ??
          err?.data?.message ??
          "Unable to get OAuth URL."
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manual Actions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Manual Sync / Bootstrap */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleManualSync}
              disabled={syncing}
            >
              {syncing ? "Running..." : "Run Sync Now"}
            </Button>

            <Button
              variant="secondary"
              onClick={handleBootstrap}
              disabled={bootstrapping}
            >
              {bootstrapping
                ? "Starting..."
                : "Bootstrap Sync"}
            </Button>
          </div>

          {/* Read-only Mode */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Read-only Mode</Label>

              <p className="text-sm text-muted-foreground">
                Prevent write operations to Lightspeed.
              </p>
            </div>

            <Switch
              checked={
                data?.data.read_only_mode ?? false
              }
              disabled={isLoading || toggling}
              onCheckedChange={handleToggle}
            />
          </div>

          {/* Lightspeed OAuth */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label>Lightspeed OAuth</Label>

              <p className="text-sm text-muted-foreground">
                Connect or reconnect your Lightspeed account.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleConnect}
            >
              Connect Lightspeed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Read-only Mode Confirmation */}
      <AlertDialog
        open={showReadOnlyAlert}
        onOpenChange={setShowReadOnlyAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingReadOnly
                ? "Enable Read-only Mode?"
                : "Disable Read-only Mode?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {pendingReadOnly ? (
                <>
                  Once Read-only Mode is enabled, you will
                  not have write access to Lightspeed. You
                  will not be able to create, update, or
                  delete any data from the web application.
                </>
              ) : (
                <>
                  Once Read-only Mode is disabled, any
                  changes you make in the web application
                  will be synced directly with Lightspeed.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row justify-end gap-2">
            <AlertDialogCancel
              className="m-0 h-10 w-[94px] min-w-[94px]"
              disabled={toggling}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmReadOnly}
              disabled={toggling}
              className="m-0 h-10 w-[94px] min-w-[94px]"
            >
              {toggling
                ? pendingReadOnly
                  ? "Enabling..."
                  : "Disabling..."
                : pendingReadOnly
                  ? "Enable"
                  : "Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}