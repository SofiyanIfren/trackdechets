import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import "./InviteNewUser.scss";
import { Mutation, Query } from "@apollo/react-components";
import gql from "graphql-tag";
import RedErrorMessage from "../form/RedErrorMessage";
import { FaTimes } from "react-icons/fa";

const INVITE_USER_TO_COMPANY = gql`
  mutation InviteUserToCompany(
    $email: String!
    $siret: String!
    $role: UserRole!
  ) {
    inviteUserToCompany(email: $email, siret: $siret, role: $role)
  }
`;
const COMPANY_USERS = gql`
  query CompanyUsers($siret: String!) {
    companyUsers(siret: $siret) {
      id
      name
      email
      role
    }
  }
`;
const REMOVE_USER = gql`
  mutation RemoveUserFromCompany($userId: ID!, $siret: String!) {
    removeUserFromCompany(userId: $userId, siret: $siret)
  }
`;
type Props = { siret: string };
export default function InviteNewUser({ siret }: Props) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div>
      <p>
        Vous êtes administrateur de cette entreprise, vous pouvez ainsi inviter
        des utilisateurs à rejoindre Trackdéchets en leur donnant accès aux
        informations de votre entreprise. Ils seront alors en mesure de créer
        des bordereaux pour cette entreprise, et de consulter les bordereaux
        déjà existants.
      </p>
      <Mutation mutation={INVITE_USER_TO_COMPANY}>
        {inviteUserToCompany => (
          <Formik
            initialValues={{ email: "", siret, role: "MEMBER" }}
            validate={(values: any) => {
              let errors: any = {};
              if (!values.email) {
                errors.email = "L'email est obligatoire";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              inviteUserToCompany({ variables: values })
                .then(_ => {
                  resetForm();
                  setShowConfirmation(true);
                  setTimeout(() => setShowConfirmation(false), 3000);
                })
                .then(_ => setSubmitting(false));
            }}
          >
            {({ isSubmitting }) => (
              <>
                <Form className="invite-form">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email de la personne à inviter"
                  />
                  <Field component="select" name="role">
                    <option value="MEMBER">Collaborateur</option>
                    <option value="ADMIN">Administrateur</option>
                  </Field>
                  <button
                    type="submit"
                    className="button"
                    disabled={isSubmitting}
                  >
                    Inviter
                  </button>
                </Form>
                <RedErrorMessage name="email" />
              </>
            )}
          </Formik>
        )}
      </Mutation>
      {showConfirmation && (
        <div className="notification success">
          L'invitation a bien été envoyée
        </div>
      )}
      <Query query={COMPANY_USERS} variables={{ siret }}>
        {({ loading, error, data }) => {
          if (loading) return <p>"Chargement..."</p>;
          if (error) return <p>{`Erreur ! ${error.message}`}</p>;

          return (
            <div>
              <h5>Membres de l'équipe ({data.companyUsers.length})</h5>
              <table className="table">
                <tbody>
                  {data.companyUsers.map((u: any) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td className="right-column">
                        {u.role !== "Administrateur" && u.name !== "Invité" && (
                          <Mutation
                            mutation={REMOVE_USER}
                            update={proxy => {
                              const data = proxy.readQuery({
                                query: COMPANY_USERS
                              });
                              if (!data || !data.companyUsers) {
                                return;
                              }
                              proxy.writeQuery({
                                query: COMPANY_USERS,
                                data: data.companyUsers.filter(
                                  cu => cu.id !== u.id
                                )
                              });
                            }}
                          >
                            {(removeUserFromCompany, { data }) => (
                              <button
                                className="button"
                                onClick={() =>
                                  removeUserFromCompany({
                                    variables: { userId: u.id, siret }
                                  })
                                }
                              >
                                <FaTimes /> Retirer les droits
                              </button>
                            )}
                          </Mutation>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }}
      </Query>
    </div>
  );
}
