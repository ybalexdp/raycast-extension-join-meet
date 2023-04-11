import { ActionPanel, Detail, List, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { GoogleAuth, JWT } from 'google-auth-library';
import { calendar_v3 } from "googleapis/build/src/apis/calendar/v3";

const today: string = new Date().getDate().toString();
const icon: string = `https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${today}_2x.png`; 

type MeetingState = {
  meetings: { event: calendar_v3.Schema$Event; url: string }[];
  isLoading: boolean;
  error?: string;
};

export default function Command() {
  const state = useMeetingInCalendar();

  if (state.error) {
    return <Detail markdown={state.error} />;
  }

  return (
    <List isLoading={state.isLoading}>
      {state.meetings.map((meeting) => (
        <List.Item
          key={meeting.event.id}
          icon={icon}
          title={meeting.event.summary || ""}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={meeting.url}  />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function useMeetingInCalendar() {
  const [state, setState] = useState<MeetingState>({ meetings: [], isLoading: true });

  useEffect(() => {
    (async () => {
      // 認証・トークン取得
      const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/calendar.readonly',
        keyFile: '/path/to/serviceaccount.json',
      });

      const client = await auth.getClient() as JWT;
      const { access_token } = await client.authorize();
      
      if (!access_token) {
        setState({ isLoading: false, meetings: [], error: "Error: No access token." });
        return;
      }

      // カレンダー一覧取得
      const calenderClient = new calendar_v3.Calendar({auth});

      // 現在時刻前後15分以内の予定を取得
      const currentDate = new Date();
      const minDate = new Date(currentDate.getTime() - 15 * 60000).toISOString();
      const maxDate = new Date(currentDate.getTime() + 15 * 60000).toISOString();
   
      const calendars = await calenderClient.events.list({
        calendarId: 'primary',
        timeMin: minDate,
        timeMax: maxDate,
        singleEvents: true,
      });

      if (!calendars?.data?.items?.[0]?.id) {
        return;
      }

      const meetings = calendars.data.items.reduce((meetings, event) => {
        let url;
        if (event.hangoutLink) {
          url = event.hangoutLink;
          meetings.push({ event, url });
        }
        return meetings;
      }, [] as MeetingState["meetings"]);

      setState({
        meetings,
        isLoading: false,
      });

    })();
  }, []);

  return state;

}