// Update the useEffect for socket message handling to properly update contacts
useEffect(() => {
  if (!socket || !businessId) return;

  socket.on(`onmessagerecv-${businessId}`, (data) => {
    console.log(`Message from server:${businessId}`, data);
    
    // Update messages
    fetchInitialMessages();
    
    // Update contacts with new message
    setContacts(prevContacts => {
      const newContacts = [...prevContacts];
      const contactIndex = newContacts.findIndex(c => 
        c.phoneNumber === (data.from === config.phoneNumber ? data.to : data.from)
      );
      
      if (contactIndex !== -1) {
        // Update existing contact
        const updatedContact = {
          ...newContacts[contactIndex],
          lastMessage: data.messageBody,
          timestamp: data.currentStatusTimestamp,
          senderName: data.senderName || newContacts[contactIndex].senderName
        };
        newContacts.splice(contactIndex, 1); // Remove old position
        newContacts.unshift(updatedContact); // Add to top
      } else {
        // Add new contact
        const country = countryList.find(c => data.from.startsWith(c.code));
        const newContact = {
          phoneNumber: data.from === config.phoneNumber ? data.to : data.from,
          lastMessage: data.messageBody,
          timestamp: data.currentStatusTimestamp,
          senderName: data.senderName || "Unknown",
          flag: country?.flag || '🌐'
        };
        newContacts.unshift(newContact);
      }
      
      return newContacts;
    });
  });

  return () => {
    socket.off(`onmessagerecv-${businessId}`);
  };
}, [socket, businessId]);

// Update sendMessage function to handle contact updates
const sendMessage = async () => {
  if (!newMessage.trim() || !selectedUser || !config?.phoneNumber || !companyId) return;

  const tempId = Date.now().toString();
  const tempMessage = {
    messageId: tempId,
    businessId: businessId,
    from: config.phoneNumber,
    to: selectedUser.phoneNumber,
    messageBody: newMessage,
    type: "text",
    status: "sending",
    currentStatusTimestamp: (Date.now() / 1000).toString(),
    sentTimestamp: (Date.now() / 1000).toString(),
    senderName: selectedUser.senderName || "Unknown"
  };

  setMessages(prev => [...prev, tempMessage]);

  // Update contacts list
  setContacts(prevContacts => {
    const newContacts = [...prevContacts];
    const contactIndex = newContacts.findIndex(c => c.phoneNumber === selectedUser.phoneNumber);
    
    if (contactIndex !== -1) {
      // Update existing contact
      const updatedContact = {
        ...newContacts[contactIndex],
        lastMessage: newMessage,
        timestamp: tempMessage.currentStatusTimestamp
      };
      newContacts.splice(contactIndex, 1); // Remove from old position
      newContacts.unshift(updatedContact); // Add to top
    } else {
      // Add new contact
      const country = countryList.find(c => selectedUser.phoneNumber.startsWith(c.code));
      const newContact = {
        ...selectedUser,
        lastMessage: newMessage,
        timestamp: tempMessage.currentStatusTimestamp,
        flag: country?.flag || '🌐'
      };
      newContacts.unshift(newContact);
    }
    
    return newContacts;
  });

  setNewMessage("");
  setTimeout(() => scrollToBottom(), 100);

  try {
    const response = await axios.post(
      `${MESSAGE_API_ENDPOINT}/send`,
      {
        to: selectedUser.phoneNumber,
        body: newMessage,
        companyId: companyId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success && response.data.data.messages) {
      const actualMessageId = response.data.data.messages[0].id;
      setMessages(prev => prev.map(msg =>
        msg.messageId === tempId
          ? { ...msg, messageId: actualMessageId, status: 'sent' }
          : msg
      ));
    }
  } catch (error) {
    console.error("Error sending message:", error);
    setMessages(prev => prev.map(msg =>
      msg.messageId === tempId
        ? { ...msg, status: "failed", failureReason: error.response?.data?.message || "Failed to send message" }
        : msg
    ));
  }
};

// Add a socket listener for message status updates
useEffect(() => {
  if (!socket || !businessId) return;

  socket.on(`messageStatus-${businessId}`, (data) => {
    setMessages(prev => prev.map(msg =>
      msg.messageId === data.messageId
        ? { ...msg, status: data.status }
        : msg
    ));
  });

  return () => {
    socket.off(`messageStatus-${businessId}`);
  };
}, [socket, businessId]);

// Update the fetchInitialMessages function to include sender names
const fetchInitialMessages = async () => {
  if (!businessId || !selectedUser) return;
  
  try {
    setLoading(true);
    const response = await axios.post(
      `${MESSAGE_API_ENDPOINT}/getMessages`,
      {
        businessId: businessId,
        from: selectedUser.phoneNumber,
        lastTimestamp: null
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success) {
      setMessages(response.data.data);
      
      // Update sender name if available
      if (response.data.data.length > 0) {
        const latestMessage = response.data.data[0];
        if (latestMessage.senderName) {
          setContacts(prev => prev.map(contact =>
            contact.phoneNumber === selectedUser.phoneNumber
              ? { ...contact, senderName: latestMessage.senderName }
              : contact
          ));
        }
      }
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    setLoading(false);
  }
};