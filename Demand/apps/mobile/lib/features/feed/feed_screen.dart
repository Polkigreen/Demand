import 'package:flutter/material.dart';
import '../../core/theme.dart';

class TaskItem {
  final String id;
  final String title;
  final String description;
  final String location;
  final String category;
  final double price;
  final String requesterName;
  final bool bankidVerified;

  TaskItem({
    required this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.category,
    required this.price,
    required this.requesterName,
    required this.bankidVerified,
  });
}

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final List<TaskItem> _allTasks = [
    TaskItem(
      id: 't1',
      title: 'Change Winter Tires on Volvo XC60',
      description: 'Need help shifting my winter tires to summer tires. I have all the tools in my garage in Solna. Takes about 30-40 mins max.',
      location: 'Stockholm, Solna',
      category: 'Automotive',
      price: 600,
      requesterName: 'Johan Andersson',
      bankidVerified: true,
    ),
    TaskItem(
      id: 't2',
      title: 'Setup Midsummer Party Decorations',
      description: 'Looking for someone to help set up lights, table arrangements, and party tents in the garden for a midsummer celebration.',
      location: 'Gothenburg, Hisingen',
      category: 'Events',
      price: 1800,
      requesterName: 'Emma Bergqvist',
      bankidVerified: true,
    ),
    TaskItem(
      id: 't3',
      title: 'Assembling IKEA Pax Wardrobe',
      description: 'Need an experienced furniture builder to assemble three Pax wardrobes with sliding doors. Requires patience and your own tools.',
      location: 'Malmö, Limhamn',
      category: 'Furniture Assembly',
      price: 1200,
      requesterName: 'Lars Nilsson',
      bankidVerified: false,
    ),
  ];

  String _selectedCategory = 'All';
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final categories = ['All', 'Automotive', 'Events', 'Furniture Assembly'];

    final filteredTasks = _allTasks.where((task) {
      final matchesCategory = _selectedCategory == 'All' || task.category == _selectedCategory;
      final matchesSearch = task.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          task.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          task.location.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Demand Sweden'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search tasks, cities, helpers...',
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                fillColor: AppColors.cardBg,
              ),
            ),
          ),

          // Categories Scroll
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.only(left: 16),
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final cat = categories[index];
                final isSelected = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(
                      cat,
                      style: TextStyle(
                        color: isSelected ? Colors.black : AppColors.textLight,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    selected: isSelected,
                    selectedColor: AppColors.primary,
                    backgroundColor: AppColors.cardBg,
                    onSelected: (selected) {
                      if (selected) {
                        setState(() => _selectedCategory = cat);
                      }
                    },
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 16),

          // Job list
          Expanded(
            child: filteredTasks.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.assignment_late_outlined, size: 64, color: AppColors.textMuted.withOpacity(0.5)),
                        const SizedBox(height: 16),
                        const Text('No active tasks found', style: TextStyle(color: AppColors.textLight, fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredTasks.length,
                    itemBuilder: (context, index) {
                      final task = filteredTasks[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 16),
                        color: AppColors.cardBg,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: const BorderSide(color: AppColors.border, width: 0.5),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Top Info row
                              Row(
                                mainAxisAlignment: MainAxisAlignment.between,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.teal.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      task.category,
                                      style: const TextStyle(color: AppColors.primary, fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                  Text(
                                    '${task.price.toStringAsFixed(0)} SEK',
                                    style: const TextStyle(color: AppColors.secondary, fontSize: 18, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              
                              // Title
                              Text(
                                task.title,
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textLight),
                              ),
                              const SizedBox(height: 8),

                              // Description
                              Text(
                                task.description,
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(color: AppColors.textMuted, fontSize: 13, height: 1.4),
                              ),
                              const SizedBox(height: 16),

                              // Separator
                              const Divider(color: AppColors.border, height: 1),
                              const SizedBox(height: 12),

                              // Bottom Poster & Actions row
                              Row(
                                mainAxisAlignment: MainAxisAlignment.between,
                                children: [
                                  Row(
                                    children: [
                                      CircleAvatar(
                                        backgroundColor: AppColors.darkBg,
                                        radius: 16,
                                        child: Text(task.requesterName[0], style: const TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                                      ),
                                      const SizedBox(width: 8),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Text(task.requesterName, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textLight)),
                                              if (task.bankidVerified)
                                                const Padding(
                                                  padding: EdgeInsets.only(left: 4),
                                                  child: Icon(Icons.verified, color: AppColors.primary, size: 14),
                                                ),
                                            ],
                                          ),
                                          const SizedBox(height: 2),
                                          Row(
                                            children: [
                                              const Icon(Icons.location_on, size: 10, color: AppColors.textMuted),
                                              const SizedBox(width: 2),
                                              Text(task.location, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                                            ],
                                          )
                                        ],
                                      )
                                    ],
                                  ),
                                  ElevatedButton(
                                    onPressed: () {},
                                    style: ElevatedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      minimumSize: Size.zero,
                                    ),
                                    child: const Text('Apply', style: TextStyle(fontSize: 13)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
