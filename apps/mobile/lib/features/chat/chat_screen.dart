import 'package:flutter/material.dart';
import '../../core/theme.dart';

class ChatMsg {
  final String id;
  final String senderId;
  final String text;
  final String timestamp;

  ChatMsg({
    required this.id,
    required this.senderId,
    required this.text,
    required this.timestamp,
  });
}

class ChatThreadItem {
  final String id;
  final String partnerName;
  final String taskTitle;
  final double price;
  final String lastMessage;
  final bool bankidVerified;
  final List<ChatMsg> messages;

  ChatThreadItem({
    required this.id,
    required this.partnerName,
    required this.taskTitle,
    required this.price,
    required this.lastMessage,
    required this.bankidVerified,
    required this.messages,
  });
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<ChatThreadItem> _threads = [
    ChatThreadItem(
      id: 't1',
      partnerName: 'Sven Svensson',
      taskTitle: 'Change Winter Tires on Volvo XC60',
      price: 600,
      lastMessage: 'Sounds great! I will be there at 14:00 tomorrow.',
      bankidVerified: true,
      messages: [
        ChatMsg(id: 'm1', senderId: 'other', text: 'Hej! I saw your post about tire shifting. I have years of experience.', timestamp: '10:30'),
        ChatMsg(id: 'm2', senderId: 'me', text: 'Hej Sven! Excellent. Do you have your own jack?', timestamp: '10:32'),
        ChatMsg(id: 'm3', senderId: 'other', text: 'I can bring my hydraulic jack just in case.', timestamp: '10:35'),
        ChatMsg(id: 'm4', senderId: 'me', text: 'Perfect. Does 14:00 work for you?', timestamp: '10:36'),
        ChatMsg(id: 'm5', senderId: 'other', text: 'Sounds great! I will be there at 14:00 tomorrow.', timestamp: '10:38'),
      ],
    ),
    ChatThreadItem(
      id: 't2',
      partnerName: 'Emma Bergqvist',
      taskTitle: 'Setup Midsummer Party Decorations',
      price: 1800,
      lastMessage: 'I will order the decorations today. See you on Friday!',
      bankidVerified: true,
      messages: [
        ChatMsg(id: 'm6', senderId: 'other', text: 'Hi! Can you let me know what color scheme you prefer for the lanterns?', timestamp: 'Yesterday'),
        ChatMsg(id: 'm7', senderId: 'me', text: 'Blue, yellow, and lots of greens!', timestamp: 'Yesterday'),
        ChatMsg(id: 'm8', senderId: 'other', text: 'I will order the decorations today. See you on Friday!', timestamp: 'Yesterday'),
      ],
    ),
  ];

  ChatThreadItem? _selectedThread;
  final _msgController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_msgController.text.trim().isEmpty || _selectedThread == null) return;

    final text = _msgController.text.trim();
    final newMsg = ChatMsg(
      id: 'new-${DateTime.now().millisecondsSinceEpoch}',
      senderId: 'me',
      text: text,
      timestamp: 'Now',
    );

    setState(() {
      _selectedThread!.messages.add(newMsg);
    });

    _msgController.clear();
    
    // Auto Scroll to bottom
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_selectedThread != null) {
      return Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => setState(() => _selectedThread = null),
          ),
          title: Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: AppColors.cardBg,
                child: Text(_selectedThread!.partnerName[0], style: const TextStyle(color: AppColors.primary, fontSize: 13, fontWeight: FontWeight.bold)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(_selectedThread!.partnerName, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textLight)),
                        if (_selectedThread!.bankidVerified)
                          const Padding(
                            padding: EdgeInsets.only(left: 4),
                            child: Icon(Icons.verified, color: AppColors.primary, size: 14),
                          ),
                      ],
                    ),
                    Text(_selectedThread!.taskTitle, style: const TextStyle(color: AppColors.textMuted, fontSize: 10), overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.1),
                border: Border.all(color: Colors.orange.withOpacity(0.2)),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                '${_selectedThread!.price.toStringAsFixed(0)} SEK',
                style: const TextStyle(color: AppColors.secondary, fontSize: 11, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        body: Column(
          children: [
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _selectedThread!.messages.length,
                itemBuilder: (context, index) {
                  final msg = _selectedThread!.messages[index];
                  final isMe = msg.senderId == 'me';

                  return Align(
                    alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isMe ? AppColors.primary : AppColors.cardBg,
                        borderRadius: BorderRadius.only(
                          topLeft: const Radius.circular(16),
                          topRight: const Radius.circular(16),
                          bottomLeft: Radius.circular(isMe ? 16 : 0),
                          bottomRight: Radius.circular(isMe ? 0 : 16),
                        ),
                        border: isMe ? null : Border.all(color: AppColors.border, width: 0.5),
                      ),
                      child: Column(
                        crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                        children: [
                          Text(
                            msg.text,
                            style: TextStyle(color: isMe ? Colors.black : AppColors.textLight, fontSize: 14, height: 1.3),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            msg.timestamp,
                            style: TextStyle(color: isMe ? Colors.black54 : AppColors.textMuted, fontSize: 9),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            
            // Text Input area
            Container(
              padding: const EdgeInsets.all(16),
              color: AppColors.cardBg,
              child: SafeArea(
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _msgController,
                        decoration: const InputDecoration(
                          hintText: 'Type your message...',
                          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    FloatingActionButton(
                      onPressed: _sendMessage,
                      backgroundColor: AppColors.primary,
                      mini: true,
                      child: const Icon(Icons.send, color: Colors.black, size: 18),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Conversations'),
      ),
      body: _threads.isEmpty
          ? const Center(
              child: Text('No messages yet.', style: TextStyle(color: AppColors.textMuted)),
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: _threads.length,
              itemBuilder: (context, index) {
                final thread = _threads[index];
                return ListTile(
                  leading: CircleAvatar(
                    backgroundColor: AppColors.cardBg,
                    child: Text(thread.partnerName[0], style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                  ),
                  title: Row(
                    children: [
                      Text(thread.partnerName, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textLight)),
                      if (thread.bankidVerified)
                        const Padding(
                          padding: EdgeInsets.only(left: 4),
                          child: Icon(Icons.verified, color: AppColors.primary, size: 14),
                        ),
                    ],
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 2),
                      Text(thread.taskTitle, style: const TextStyle(color: AppColors.primary, fontSize: 11)),
                      const SizedBox(height: 2),
                      Text(thread.lastMessage, style: const TextStyle(color: AppColors.textMuted, fontSize: 12), overflow: TextOverflow.ellipsis),
                    ],
                  ),
                  trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
                  onTap: () => setState(() => _selectedThread = thread),
                );
              },
            ),
    );
  }
}
