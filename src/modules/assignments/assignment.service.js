const supabase = require('../../config/supabaseClient');

class AssignmentService {
    /**
     * Retrieves assignments for a specific user optionally filtered by status.
     */
    static async getAssignments(userId, filters = {}) {
        let query = supabase.from('assignments').select('*').eq('user_id', userId);

        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query.order('due_date', { ascending: true });

        if (error) throw error;
        return data;
    }

    /**
     * Creates a new assignment.
     */
    static async createAssignment(userId, assignmentData) {
        const { data, error } = await supabase
            .from('assignments')
            .insert([
                { user_id: userId, ...assignmentData }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Updates an existing assignment verifying ownership.
     */
    static async updateAssignment(userId, assignmentId, updateData) {
        const { data, error } = await supabase
            .from('assignments')
            .update(updateData)
            .eq('id', assignmentId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') throw new Error('Assignment not found or unauthorized');
            throw error;
        }
        return data;
    }

    /**
     * Deletes an assignment verifying ownership.
     */
    static async deleteAssignment(userId, assignmentId) {
        const { data, error } = await supabase
            .from('assignments')
            .delete()
            .eq('id', assignmentId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') throw new Error('Assignment not found or unauthorized');
            throw error;
        }
        return data;
    }
}

module.exports = AssignmentService;
