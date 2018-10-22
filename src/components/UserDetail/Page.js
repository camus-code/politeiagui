import React from "react";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import Message from "../Message";
import { Tabs, Tab } from "../Tabs";
import GeneralTab from "./GeneralTab";
import ProposalsTab from "./ProposalsTab";
import CommentsTab from "./CommentsTab";
import {
  USER_DETAIL_TAB_GENERAL,
  USER_DETAIL_TAB_PROPOSALS,
  USER_DETAIL_TAB_COMMENTS
} from "../../constants";
import { CHANGE_USERNAME_MODAL } from "../Modal/modalTypes";
import userConnector from "../../connectors/user";

const UserDetailPage = ({
  isLoading,
  user,
  loggedInAsUserId,
  loggedInAsUsername,
  error,
  tabId,
  onTabChange,
  dcrdataTxUrl,
  isAdmin,
  openModal
}) => {
  const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);
  console.log(loggedInAsUsername);
  return (
    <div className="content" role="main">
      <div className="page user-page">
        {isLoading && <PageLoadingIcon />}
        {error && (
          <Message
            type="error"
            header="Error loading user"
            body={error}
          />
        )}
        {user && (
          <div>
            <div className="detail-header">
              <div className="detail-username">
                {loggedInAsUsername}
                {user.isadmin && (
                  <span className="detail-admin">(admin user)</span>
                )}
                {isAdminOrTheUser ?
                  <a style={{ marginLeft: "1.25em", marginTop: ".5em", fontSize: ".75em" }} className="linkish"
                    onClick={() => openModal(CHANGE_USERNAME_MODAL)}>Change Username</a> : null}
              </div>
              <div className="detail-email">{user.email}</div>
              <Tabs>
                {isAdminOrTheUser ? <Tab
                  title="General"
                  selected={tabId === USER_DETAIL_TAB_GENERAL}
                  tabId={USER_DETAIL_TAB_GENERAL}
                  onTabChange={onTabChange} /> : null}
                <Tab
                  title="Proposals"
                  count={user.numofproposals}
                  selected={tabId === USER_DETAIL_TAB_PROPOSALS}
                  tabId={USER_DETAIL_TAB_PROPOSALS}
                  onTabChange={onTabChange} />
                <Tab
                  title={"Comments"}
                  count={(user.comments && user.comments.length) || 0}
                  selected={tabId === USER_DETAIL_TAB_COMMENTS}
                  tabId={USER_DETAIL_TAB_COMMENTS}
                  onTabChange={onTabChange} />
              </Tabs>
            </div>
            <div className="detail-tab-body">
              {tabId === USER_DETAIL_TAB_GENERAL && <GeneralTab dcrdataTxUrl={dcrdataTxUrl} />}
              {tabId === USER_DETAIL_TAB_PROPOSALS && <ProposalsTab count={user.numofproposals} />}
              {tabId === USER_DETAIL_TAB_COMMENTS && <CommentsTab />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default userConnector(UserDetailPage);
