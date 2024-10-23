'use client';

import React, { useState } from 'react';
import { Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Highlight from '../../components/Highlight';

function Profile() {
  const { user, isLoading } = useUser();
  const [description, setDescription] = useState(user?.description || '');
  const [updateMessage, setUpdateMessage] = useState('');

  const handleUpdateDescription = async () => {
    try {
      const res = await fetch('/api/users/updateDescription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
  
      if (!res.ok) {
        const errorData = await res.text(); // Read response as text for error details
        throw new Error(errorData);
      }
  
      const data = await res.json();
      setUpdateMessage(data.message);
    } catch (error) {
      console.error('Failed to update description:', error);
      setUpdateMessage('Error updating description. Please try again.');
    }
  };
  

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decode="async"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.name}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
              <Form>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write something about yourself..."
                  />
                </FormGroup>
                <Button color="primary" onClick={handleUpdateDescription}>
                  Update Description
                </Button>
                {updateMessage && <p className="mt-3">{updateMessage}</p>}
              </Form>
            </Col>
          </Row>
          <Row data-testid="profile-json">
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
          </Row>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: (error) => <ErrorMessage>{error.message}</ErrorMessage>,
});
