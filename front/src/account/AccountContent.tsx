import React, { useRef, useState } from "react";
import gql from "graphql-tag";
import { Query, ApolloConsumer } from "@apollo/react-components";
import { FaCopy } from "react-icons/fa";
import { RouteComponentProps, withRouter } from "react-router";
import { localAuthService } from "../login/auth.service";
import EditProfile from "./EditProfile";
import Company from "./Company";
import "./Account.scss";
import "../Utils.scss";
import { Me } from "../login/model";

export const GET_ME = gql`
  {
    me {
      id
      name
      email
      phone
      companies {
        id
        admins {
          id
          name
        }
        siret
        name
        address
        securityCode
        companyTypes
      }
    }
  }
`;

const API_KEY = gql`
  query ApiKey {
    apiKey
  }
`;

export default withRouter(function AccountContent({
  history
}: RouteComponentProps) {
  const [apiKey, setApiKey] = useState("");
  const [showUserForm, setShowUserForm] = useState(false);
  const tokenRef = useRef<any>(undefined);

  return (
    <Query query={GET_ME}>
      {({ loading, error, data }) => {
        if (loading) return <div>Chargement</div>;
        if (error) return <div>{`Erreur ! ${error.message}`}</div>;

        const me = data.me as Me;

        function copyTokenToClipboard() {
          tokenRef.current.select();
          document.execCommand("copy");
        }

        // add isAdmin to company information
        const companies = me.companies.map(company => {
          const admins = company.admins.map(a => a.id);
          const isAdmin = admins.indexOf(me.id) > -1;
          const c = { ...company, isAdmin };
          delete c.admins;
          return c;
        });

        return (
          <>
            <div className="title">
              <h2>Paramètres du compte</h2>
            </div>
            <p>
              Vous êtes connecté en tant que <strong>{me.name}</strong>
              <br />
              Email: {me.email}
              <br />
              Téléphone: {me.phone}
              <br />
            </p>
            {!showUserForm && (
              <button
                className="button"
                onClick={() => setShowUserForm(!showUserForm)}
              >
                Editer mon profil
              </button>
            )}
            {showUserForm && (
              <EditProfile
                me={me}
                onSubmit={() => setShowUserForm(!showUserForm)}
              />
            )}
            <button
              className="button"
              onClick={() => history.push("/password")}
            >
              Changer de mot de passe
            </button>

            <h4>Entreprise(s) associée(s):</h4>
            {companies.map((c, idx) => (
              <Company key={idx} company={c} />
            ))}

            <h4>Intégration API</h4>
            <p>
              Si vous souhaitez utiliser nos API pour vous intégrer avec
              Trackdéchets, vous aurez besoin d'une clé d'API pour authentifier
              vos appels. Vous pouvez la générer ci-dessous.
            </p>

            {apiKey ? (
              <div className="form__group account__form">
                <label>Token</label>
                <div className="input__group">
                  <input type="text" value={apiKey} ref={tokenRef} readOnly />
                  <button
                    className="button icon-button"
                    onClick={copyTokenToClipboard}
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            ) : (
              <ApolloConsumer>
                {client => (
                  <div>
                    <button
                      className="button"
                      onClick={async () => {
                        const { data } = await client.query<{
                          apiKey: string;
                        }>({
                          query: API_KEY
                        });
                        setApiKey(data.apiKey);
                      }}
                    >
                      Générer une clé
                    </button>
                  </div>
                )}
              </ApolloConsumer>
            )}

            <h4>Déconnexion</h4>
            <p>
              <button
                className="button"
                onClick={() => {
                  localAuthService.locallySignOut();
                  history.push("/");
                }}
              >
                Me déconnecter
              </button>
            </p>
          </>
        );
      }}
    </Query>
  );
});