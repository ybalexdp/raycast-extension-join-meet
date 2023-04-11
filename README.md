# raycast-extension-join-meet

raycast extension to access Google meets set in google calendar for 15 minutes before and after the current time.

# Usage

## config
This code assumes authentication with a service account to use the Google Calendar API.
Please create a service account from the google cloud site and retrieve the json file required for authentication.

- [Create Service Account](https://cloud.google.com/docs/authentication/production?#create_service_account)
- [Creating and Managing Service Account Keys](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)

Replace the path set in keyFile in the following code(in src/index.tsx ) with the path of the key file actually stored.

```tsx :  src/index.tsx
keyFile: '/path/to/serviceaccount.json',
```

