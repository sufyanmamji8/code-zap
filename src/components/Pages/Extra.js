import React, { useState, useEffect, useRef } from "react";
// ... (keep existing imports)

const WhatsAppChats = () => {
  // ... (keep all existing state and functions until renderChatWindow)

  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(parseInt(timestamp) * 1000);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(parseInt(message.currentStatusTimestamp) * 1000).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const renderChatWindow = () => {
    const chatMessages = selectedUser ? 
      messages.filter(msg => 
        msg.from === selectedUser.phoneNumber || msg.to === selectedUser.phoneNumber
      ) : [];

    const groupedMessages = groupMessagesByDate(chatMessages);
    
    return (
      <Col
        xs="12"
        md="8"
        style={{
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f4f8fb",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ... (keep existing header code) */}

        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#efeae2",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM9.414 40l5.95-5.95-1.414-1.414L8 38.586l-5.95-5.95L.636 34.05 6.586 40l-5.95 5.95 1.414 1.414L8 41.414l5.95 5.95 1.414-1.414L9.414 40z' fill='%239C92AC' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            marginBottom: isMobileView ? "60px" : 0,
          }}
        >
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '20px 0',
                position: 'relative',
              }}>
                <div style={{
                  backgroundColor: '#E1F2FA',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#54656f',
                  boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
                  fontWeight: '500',
                }}>
                  {formatMessageDate(dateMessages[0].currentStatusTimestamp)}
                </div>
              </div>

              {dateMessages.map((message) => {
                const isReceived = message.from === selectedUser.phoneNumber;
                return (
                  <div
                    key={message.messageId}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isReceived ? "flex-start" : "flex-end",
                      marginBottom: "12px",
                      position: "relative"
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        maxWidth: "70%",
                        padding: "10px 14px",
                        backgroundColor: isReceived ? "#fff" : "#dcf8c6",
                        borderRadius: "12px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                        borderTopLeftRadius: isReceived ? "0" : "12px",
                        borderTopRightRadius: isReceived ? "12px" : "0",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          [isReceived ? "left" : "right"]: -8,
                          width: "8px",
                          height: "16px",
                          backgroundColor: isReceived ? "#fff" : "#dcf8c6",
                          clipPath: isReceived ? 
                            "polygon(100% 0, 0 0, 100% 100%)" : 
                            "polygon(0 0, 100% 0, 0 100%)"
                        }}
                      />
                      
                      <div style={{ 
                        fontSize: "14px", 
                        color: "#303030",
                        marginRight: "24px",
                        lineHeight: "1.4",
                        wordBreak: "break-word"
                      }}>
                        {message.messageBody}
                      </div>
                      
                      <div style={{ 
                        fontSize: "11px", 
                        color: "#667781", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "4px",
                        marginTop: "4px"
                      }}>
                        <span>
                          {new Date(parseInt(message.currentStatusTimestamp) * 1000)
                            .toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                        </span>
                        {!isReceived && (
                          <MessageStatusIcon status={message.status} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* ... (keep existing input area code) */}
      </Col>
    );
  };

  // ... (keep rest of the component code)
};

export default WhatsAppChats;