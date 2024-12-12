
export async function saveToNotion(message: SlackMessage, notionToken: string) {
    const notionDatabaseId = await getNotionDatabaseId(notionToken);

    const data = {
        parent: { database_id: notionDatabaseId },
        properties: {
            ClientMessageId: {
                title: [
                  {
                    text: {
                      content: message.client_msg_id,
                    },
                  },
                ],
              },
            User : {
                rich_text: [
                    {
                    text: {
                        content: message.user,
                    },
                    },
                ],
            },
            Date: {
                date: {
                    start: message.timestamp.toISOString(),
                },
            },
            Message: {
                    rich_text: [
                        {
                        text: {
                            content:message.text,
                        },
                        },
                    ],
                },
            },
    };
    console.log("sending", data ,"to notion", notionDatabaseId);
    const response = await fetch(`https://api.notion.com/v1/pages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify(data)
    });
    console.log("response", await response.json());
}

async function getNotionDatabaseId(notionToken: string) {
    let response = await fetch(`https://api.notion.com/v1/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${notionToken}`,
            'Notion-Version': '2022-06-28',
        },
        body: '{"filter":{"value":"database","property":"object"}}'
    });
    const json = await response.json()
    console.log("response", json);
    return json.results[0]["id"];
}