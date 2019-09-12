import {
  Button,
  Card,
  classNames,
  Message,
  Modal,
  P,
  Spinner,
  Text
} from "pi-ui";
import React, { useCallback, useEffect } from "react";
import { withRouter } from "react-router-dom";
import DevelopmentOnlyContent from "src/componentsv2/DevelopmentOnlyContent";
import ModalConfirm from "src/componentsv2/ModalConfirm";
import ModalImportIdentity from "src/componentsv2/ModalImportIdentity";
import PrivateKeyDownloadManager from "src/componentsv2/PrivateKeyDownloadManager";
import { PUB_KEY_STATUS_LOADING } from "src/constants";
import { verifyUserPubkey } from "src/helpers";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import useBooleanState from "src/hooks/utils/useBooleanState";
import styles from "./Identity.module.css";
import IdentityList from "./IdentityList";

const Identity = ({ history, loadingKey, pubkey, id: userID, identities }) => {
  const {
    loggedInAsUserId,
    loggedInAsEmail,
    userPubkey,
    user,
    identityImportSuccess,
    onUpdateUserKey,
    updateUserKey,
    keyMismatch,
    keyMismatchAction,
    shouldAutoVerifyKey
  } = useUserIdentity();
  const [
    showConfirmModal,
    openConfirmModal,
    closeConfirmModal
  ] = useBooleanState(false);
  const [
    showImportIdentityModal,
    openImportIdentityModal,
    closeImportIdentityModal
  ] = useBooleanState(false);
  const [
    showShowAllModal,
    openShowAllModal,
    closeShowAllModal
  ] = useBooleanState(false);
  useEffect(() => {
    verifyUserPubkey(loggedInAsEmail, userPubkey, keyMismatchAction);
  }, [loggedInAsEmail, userPubkey, keyMismatchAction]);

  const updateKey = useCallback(async () => {
    try {
      await onUpdateUserKey(loggedInAsEmail);
    } catch (e) {
      throw e;
    }
  }, [onUpdateUserKey, loggedInAsEmail]);

  const isUserPageOwner = user && loggedInAsUserId === user.id;
  return loadingKey === PUB_KEY_STATUS_LOADING ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card paddingSize="small">
      {isUserPageOwner && (
        <>
          <Text
            color="grayDark"
            weight="semibold"
            className={styles.fieldHeading}
          >
            Public key
          </Text>
          {shouldAutoVerifyKey &&
          updateUserKey &&
          updateUserKey.verificationtoken ? (
            <DevelopmentOnlyContent style={{ margin: "1rem 0 1rem 0" }} show>
              <Button
                type="button"
                onClick={() =>
                  history.push(
                    `/user/key/verify?verificationtoken=${updateUserKey.verificationtoken}`
                  )
                }
              >
                Auto verify key
              </Button>
            </DevelopmentOnlyContent>
          ) : keyMismatch && !identityImportSuccess ? (
            <>
              <Message className="margin-top-s" kind="error">
                Your key is invalid or inexistent. Please create/import one.
              </Message>
              <P className="margin-top-s">
                The public key on the Politeia server differs from the key on
                your browser. This is usually caused from the local data on your
                browser being cleared or by using a different browser.
              </P>
              <P className="margin-bottom-s">
                You can fix this by importing your old identity, logging in with
                the proper browser, or by creating a new identity (destroying
                your old identity)
              </P>
            </>
          ) : (
            (pubkey || userPubkey) && (
              <div
                className={classNames(
                  styles.fieldHeading,
                  "margin-bottom-s",
                  "margin-top-s"
                )}
              >
                <Text backgroundColor="blueLighter" monospace>
                  {pubkey || userPubkey}
                </Text>
              </div>
            )
          )}
          <div className={styles.buttonsWrapper}>
            <Button size="sm" onClick={openConfirmModal}>
              Create new identity
            </Button>
            {!keyMismatch && <PrivateKeyDownloadManager />}
            <Button size="sm" onClick={openImportIdentityModal}>
              Import identity
            </Button>
          </div>
        </>
      )}
      <Text
        color="grayDark"
        weight="semibold"
        className={classNames(
          styles.fieldHeading,
          "margin-bottom-s",
          isUserPageOwner && "margin-top-l"
        )}
      >
        Past public keys
      </Text>
      <Button size="sm" onClick={openShowAllModal}>
        Show all
      </Button>
      <Text
        color="grayDark"
        weight="semibold"
        className={classNames(
          styles.fieldHeading,
          "margin-bottom-s",
          "margin-top-l"
        )}
      >
        User ID
      </Text>
      <Text backgroundColor="blueLighter" monospace>
        {userID}
      </Text>
      <ModalConfirm
        title="Create new identity"
        message="Are you sure you want to generate a new identity?"
        show={showConfirmModal}
        onClose={closeConfirmModal}
        onSubmit={updateKey}
        successTitle="Create new identity"
        successMessage={`Your new identity has been requested, please check your email at ${loggedInAsEmail} to verify and activate it.

          The verification link needs to be open with the same browser that you used to generate this new identity.`}
      />
      <ModalImportIdentity
        show={showImportIdentityModal}
        onClose={closeImportIdentityModal}
      />
      <Modal
        show={showShowAllModal}
        onClose={closeShowAllModal}
        title="Past public keys"
      >
        <IdentityList full identities={identities} />
      </Modal>
    </Card>
  );
};

export default withRouter(Identity);