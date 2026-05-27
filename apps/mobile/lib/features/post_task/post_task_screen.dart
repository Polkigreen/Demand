import 'package:flutter/material.dart';
import '../../core/theme.dart';

class PostTaskScreen extends StatefulWidget {
  const PostTaskScreen({super.key});

  @override
  State<PostTaskScreen> createState() => _PostTaskScreenState();
}

class _PostTaskScreenState extends State<PostTaskScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _priceController = TextEditingController();
  final _locationController = TextEditingController();
  final _descController = TextEditingController();
  
  String _selectedCategory = 'Automotive';
  bool _success = false;

  @override
  void dispose() {
    _titleController.dispose();
    _priceController.dispose();
    _locationController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _success = true;
      });

      Future.delayed(const Duration(seconds: 2), () {
        if (!mounted) return;
        setState(() {
          _success = false;
          _titleController.clear();
          _priceController.clear();
          _locationController.clear();
          _descController.clear();
        });
        
        // Go back to feed tab
        DefaultTabController.of(context).animateTo(0);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final categories = ['Automotive', 'Events', 'Furniture Assembly', 'Cleaning', 'Garden'];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Post a Help Request'),
      ),
      body: _success
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check_circle, size: 64, color: AppColors.primary),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Request Posted Successfully!',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textLight),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Helpers in Sweden will now be notified and can apply.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Title
                    const Text('Task Title', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textMuted)),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _titleController,
                      decoration: const InputDecoration(hintText: 'e.g. Help assembly IKEA bookcase'),
                      validator: (value) => value == null || value.isEmpty ? 'Please enter a title' : null,
                    ),
                    const SizedBox(height: 20),

                    // Category & Budget
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Category', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textMuted)),
                              const SizedBox(height: 8),
                              DropdownButtonFormField<String>(
                                value: _selectedCategory,
                                decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 12)),
                                items: categories.map((cat) {
                                  return DropdownMenuItem(value: cat, child: Text(cat, style: const TextStyle(fontSize: 14)));
                                }).toList(),
                                onChanged: (val) => setState(() => _selectedCategory = val ?? 'Automotive'),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Budget (SEK)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textMuted)),
                              const SizedBox(height: 8),
                              TextFormField(
                                controller: _priceController,
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(hintText: 'e.g. 500'),
                                validator: (value) => value == null || value.isEmpty ? 'Enter compensation' : null,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Location
                    const Text('Location', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textMuted)),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _locationController,
                      decoration: const InputDecoration(hintText: 'e.g. Gothenburg, Centrum'),
                      validator: (value) => value == null || value.isEmpty ? 'Enter a location' : null,
                    ),
                    const SizedBox(height: 20),

                    // Description
                    const Text('Details / Description', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textMuted)),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _descController,
                      maxLines: 4,
                      decoration: const InputDecoration(hintText: 'Describe details, tools needed, duration...'),
                      validator: (value) => value == null || value.isEmpty ? 'Please describe details' : null,
                    ),
                    const SizedBox(height: 24),

                    // Compliancy Banner
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.orange.withOpacity(0.08),
                        border: Border.all(color: Colors.orange.withOpacity(0.2)),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(Icons.warning_amber_rounded, color: AppColors.secondary, size: 18),
                          SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'Swedish Tax Agency Note: Requesters and helpers are subject to hobbyverksamhet rules. Ensure payment reports are logged.',
                              style: TextStyle(color: AppColors.secondary, fontSize: 11, height: 1.4),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    ElevatedButton(
                      onPressed: _submitForm,
                      child: const Text('Post Request'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
