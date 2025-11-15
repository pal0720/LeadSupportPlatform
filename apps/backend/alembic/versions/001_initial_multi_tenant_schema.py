"""Initial multi-tenant schema with all models

Revision ID: 001
Revises:
Create Date: 2025-11-15 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pgvector extension
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')

    # Create enums
    op.execute("""
        CREATE TYPE subscriptiontier AS ENUM ('free', 'starter', 'professional', 'enterprise');
        CREATE TYPE workspacestatus AS ENUM ('trial', 'active', 'suspended', 'cancelled');
        CREATE TYPE userrole AS ENUM ('owner', 'admin', 'marketing_manager', 'sales_rep', 'support_agent', 'executive', 'guest');
        CREATE TYPE dealstage AS ENUM ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
        CREATE TYPE activitytype AS ENUM ('task', 'call', 'meeting', 'email', 'note');
        CREATE TYPE activitystatus AS ENUM ('pending', 'completed', 'cancelled');
        CREATE TYPE agentstatus AS ENUM ('idle', 'busy', 'error', 'disabled');
        CREATE TYPE integrationtype AS ENUM ('crm', 'email', 'calendar', 'social', 'ads', 'enrichment', 'payment', 'analytics', 'communication', 'storage');
        CREATE TYPE leadstatus AS ENUM ('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost');
        CREATE TYPE sequencestatus AS ENUM ('draft', 'active', 'paused', 'completed');
        CREATE TYPE enrollmentstatus AS ENUM ('active', 'paused', 'completed', 'failed');
        CREATE TYPE ticketstatus AS ENUM ('open', 'pending', 'resolved', 'closed');
        CREATE TYPE ticketpriority AS ENUM ('low', 'medium', 'high', 'urgent');
        CREATE TYPE emailstatus AS ENUM ('draft', 'scheduled', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed');
        CREATE TYPE campaignstatus AS ENUM ('draft', 'scheduled', 'active', 'paused', 'completed');
    """)

    # Workspaces table
    op.create_table('workspaces',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(100), nullable=False, unique=True),
        sa.Column('subscription_tier', sa.Enum('free', 'starter', 'professional', 'enterprise', name='subscriptiontier'), server_default='free'),
        sa.Column('status', sa.Enum('trial', 'active', 'suspended', 'cancelled', name='workspacestatus'), server_default='trial'),
        sa.Column('stripe_customer_id', sa.String(255), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(255), nullable=True),
        sa.Column('trial_ends_at', sa.DateTime, nullable=True),
        sa.Column('max_users', sa.Integer, server_default='2'),
        sa.Column('max_contacts', sa.Integer, server_default='1000'),
        sa.Column('max_ai_requests_per_month', sa.Integer, server_default='100'),
        sa.Column('current_ai_requests', sa.Integer, server_default='0'),
        sa.Column('billing_email', sa.String(255), nullable=True),
        sa.Column('brand_colors', postgresql.JSONB, server_default='{}'),
        sa.Column('brand_voice', sa.Text, nullable=True),
        sa.Column('brand_fonts', postgresql.JSONB, server_default='{}'),
        sa.Column('settings', postgresql.JSONB, server_default='{}'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_workspaces_slug', 'workspaces', ['slug'])
    op.create_index('ix_workspaces_stripe_customer_id', 'workspaces', ['stripe_customer_id'])

    # Users table
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('is_active', sa.Boolean, server_default='true'),
        sa.Column('is_superuser', sa.Boolean, server_default='false'),
        sa.Column('avatar_url', sa.String(500), nullable=True),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('timezone', sa.String(100), server_default='UTC'),
        sa.Column('preferences', postgresql.JSONB, server_default='{}'),
        sa.Column('last_login_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_users_email', 'users', ['email'])

    # Workspace Members (many-to-many relationship)
    op.create_table('workspace_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('role', sa.Enum('owner', 'admin', 'marketing_manager', 'sales_rep', 'support_agent', 'executive', 'guest', name='userrole'), nullable=False),
        sa.Column('permissions', postgresql.JSONB, server_default='{}'),
        sa.Column('invited_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('joined_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.UniqueConstraint('workspace_id', 'user_id', name='uq_workspace_user'),
    )
    op.create_index('ix_workspace_members_workspace_id', 'workspace_members', ['workspace_id'])
    op.create_index('ix_workspace_members_user_id', 'workspace_members', ['user_id'])

    # Brand Kit table
    op.create_table('brand_kits',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('logo_url', sa.String(500), nullable=True),
        sa.Column('primary_color', sa.String(50), nullable=True),
        sa.Column('secondary_color', sa.String(50), nullable=True),
        sa.Column('accent_color', sa.String(50), nullable=True),
        sa.Column('font_heading', sa.String(100), nullable=True),
        sa.Column('font_body', sa.String(100), nullable=True),
        sa.Column('brand_voice_tone', sa.String(100), nullable=True),
        sa.Column('brand_voice_description', sa.Text, nullable=True),
        sa.Column('messaging_guidelines', postgresql.JSONB, server_default='{}'),
        sa.Column('visual_guidelines', postgresql.JSONB, server_default='{}'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_brand_kits_workspace_id', 'brand_kits', ['workspace_id'])

    # Companies table
    op.create_table('companies',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('domain', sa.String(255), nullable=True),
        sa.Column('industry', sa.String(255), nullable=True),
        sa.Column('size', sa.String(50), nullable=True),
        sa.Column('revenue', sa.Float, nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('website', sa.String(500), nullable=True),
        sa.Column('linkedin_url', sa.String(500), nullable=True),
        sa.Column('twitter_url', sa.String(500), nullable=True),
        sa.Column('address', postgresql.JSONB, server_default='{}'),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('custom_fields', postgresql.JSONB, server_default='{}'),
        sa.Column('tags', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_companies_workspace_id', 'companies', ['workspace_id'])
    op.create_index('ix_companies_domain', 'companies', ['domain'])

    # Contacts table
    op.create_table('contacts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='SET NULL'), nullable=True),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('first_name', sa.String(255), nullable=True),
        sa.Column('last_name', sa.String(255), nullable=True),
        sa.Column('title', sa.String(255), nullable=True),
        sa.Column('phone', sa.String(50), nullable=True),
        sa.Column('linkedin_url', sa.String(500), nullable=True),
        sa.Column('twitter_url', sa.String(500), nullable=True),
        sa.Column('address', postgresql.JSONB, server_default='{}'),
        sa.Column('custom_fields', postgresql.JSONB, server_default='{}'),
        sa.Column('tags', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_contacts_workspace_id', 'contacts', ['workspace_id'])
    op.create_index('ix_contacts_email', 'contacts', ['email'])
    op.create_index('ix_contacts_company_id', 'contacts', ['company_id'])

    # Leads table
    op.create_table('leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='SET NULL'), nullable=True),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='SET NULL'), nullable=True),
        sa.Column('status', sa.Enum('new', 'contacted', 'qualified', 'unqualified', 'converted', 'lost', name='leadstatus'), server_default='new'),
        sa.Column('source', sa.String(100), nullable=True),
        sa.Column('score', sa.Integer, server_default='0'),
        sa.Column('ai_score', sa.Float, nullable=True),
        sa.Column('ai_insights', postgresql.JSONB, server_default='{}'),
        sa.Column('title', sa.String(500), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('estimated_value', sa.Float, nullable=True),
        sa.Column('custom_fields', postgresql.JSONB, server_default='{}'),
        sa.Column('tags', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_leads_workspace_id', 'leads', ['workspace_id'])
    op.create_index('ix_leads_status', 'leads', ['status'])
    op.create_index('ix_leads_score', 'leads', ['score'])

    # Pipelines table
    op.create_table('pipelines',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('stages', postgresql.JSONB, server_default='[]'),
        sa.Column('is_default', sa.Boolean, server_default='false'),
        sa.Column('display_order', sa.Integer, server_default='0'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_pipelines_workspace_id', 'pipelines', ['workspace_id'])

    # Deals table
    op.create_table('deals',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('pipeline_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('pipelines.id', ondelete='SET NULL'), nullable=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('primary_contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='SET NULL'), nullable=True),
        sa.Column('name', sa.String(500), nullable=False),
        sa.Column('stage', sa.Enum('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost', name='dealstage'), server_default='prospecting'),
        sa.Column('amount', sa.Float, nullable=True),
        sa.Column('currency', sa.String(10), server_default='USD'),
        sa.Column('probability', sa.Integer, server_default='0'),
        sa.Column('expected_close_date', sa.Date, nullable=True),
        sa.Column('actual_close_date', sa.Date, nullable=True),
        sa.Column('ai_win_probability', sa.Float, nullable=True),
        sa.Column('ai_insights', postgresql.JSONB, server_default='{}'),
        sa.Column('loss_reason', sa.Text, nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('custom_fields', postgresql.JSONB, server_default='{}'),
        sa.Column('tags', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('owner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_deals_workspace_id', 'deals', ['workspace_id'])
    op.create_index('ix_deals_stage', 'deals', ['stage'])
    op.create_index('ix_deals_company_id', 'deals', ['company_id'])

    # Activities table
    op.create_table('activities',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('activity_type', sa.Enum('task', 'call', 'meeting', 'email', 'note', name='activitytype'), nullable=False),
        sa.Column('status', sa.Enum('pending', 'completed', 'cancelled', name='activitystatus'), server_default='pending'),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('due_date', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('duration_minutes', sa.Integer, nullable=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=True),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='CASCADE'), nullable=True),
        sa.Column('deal_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('deals.id', ondelete='CASCADE'), nullable=True),
        sa.Column('assigned_to', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_activities_workspace_id', 'activities', ['workspace_id'])
    op.create_index('ix_activities_status', 'activities', ['status'])
    op.create_index('ix_activities_due_date', 'activities', ['due_date'])

    # Notes table
    op.create_table('notes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('is_pinned', sa.Boolean, server_default='false'),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=True),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='CASCADE'), nullable=True),
        sa.Column('deal_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('deals.id', ondelete='CASCADE'), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_notes_workspace_id', 'notes', ['workspace_id'])

    # Timeline table
    op.create_table('timeline',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('title', sa.String(500), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=True),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='CASCADE'), nullable=True),
        sa.Column('deal_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('deals.id', ondelete='CASCADE'), nullable=True),
        sa.Column('actor_type', sa.String(50), nullable=True),
        sa.Column('actor_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('data', postgresql.JSONB, server_default='{}'),
        sa.Column('occurred_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('ix_timeline_workspace_id', 'timeline', ['workspace_id'])
    op.create_index('ix_timeline_event_type', 'timeline', ['event_type'])
    op.create_index('ix_timeline_occurred_at', 'timeline', ['occurred_at'])

    # Sequences table
    op.create_table('sequences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('status', sa.Enum('draft', 'active', 'paused', 'completed', name='sequencestatus'), server_default='draft'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_sequences_workspace_id', 'sequences', ['workspace_id'])

    # Sequence Steps table
    op.create_table('sequence_steps',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('sequence_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('sequences.id', ondelete='CASCADE'), nullable=False),
        sa.Column('step_number', sa.Integer, nullable=False),
        sa.Column('step_type', sa.String(50), nullable=False),
        sa.Column('delay_days', sa.Integer, server_default='0'),
        sa.Column('subject', sa.String(500), nullable=True),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('config', postgresql.JSONB, server_default='{}'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_sequence_steps_sequence_id', 'sequence_steps', ['sequence_id'])

    # Sequence Enrollments table
    op.create_table('sequence_enrollments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('sequence_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('sequences.id', ondelete='CASCADE'), nullable=False),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.Enum('active', 'paused', 'completed', 'failed', name='enrollmentstatus'), server_default='active'),
        sa.Column('current_step', sa.Integer, server_default='0'),
        sa.Column('started_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_sequence_enrollments_sequence_id', 'sequence_enrollments', ['sequence_id'])
    op.create_index('ix_sequence_enrollments_contact_id', 'sequence_enrollments', ['contact_id'])

    # Email Templates table
    op.create_table('email_templates',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('subject', sa.String(500), nullable=False),
        sa.Column('body_html', sa.Text, nullable=False),
        sa.Column('body_text', sa.Text, nullable=True),
        sa.Column('category', sa.String(100), nullable=True),
        sa.Column('variables', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_email_templates_workspace_id', 'email_templates', ['workspace_id'])

    # Email Campaigns table
    op.create_table('email_campaigns',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('status', sa.Enum('draft', 'scheduled', 'active', 'paused', 'completed', name='campaignstatus'), server_default='draft'),
        sa.Column('template_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('email_templates.id', ondelete='SET NULL'), nullable=True),
        sa.Column('scheduled_at', sa.DateTime, nullable=True),
        sa.Column('sent_at', sa.DateTime, nullable=True),
        sa.Column('total_sent', sa.Integer, server_default='0'),
        sa.Column('total_delivered', sa.Integer, server_default='0'),
        sa.Column('total_opened', sa.Integer, server_default='0'),
        sa.Column('total_clicked', sa.Integer, server_default='0'),
        sa.Column('total_bounced', sa.Integer, server_default='0'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_email_campaigns_workspace_id', 'email_campaigns', ['workspace_id'])

    # Email Sends table
    op.create_table('email_sends',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('campaign_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('email_campaigns.id', ondelete='CASCADE'), nullable=True),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.Enum('draft', 'scheduled', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', name='emailstatus'), server_default='draft'),
        sa.Column('subject', sa.String(500), nullable=False),
        sa.Column('body_html', sa.Text, nullable=False),
        sa.Column('sent_at', sa.DateTime, nullable=True),
        sa.Column('delivered_at', sa.DateTime, nullable=True),
        sa.Column('opened_at', sa.DateTime, nullable=True),
        sa.Column('clicked_at', sa.DateTime, nullable=True),
        sa.Column('error_message', sa.Text, nullable=True),
        sa.Column('metadata', postgresql.JSONB, server_default='{}'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_email_sends_campaign_id', 'email_sends', ['campaign_id'])
    op.create_index('ix_email_sends_contact_id', 'email_sends', ['contact_id'])

    # Tickets table
    op.create_table('tickets',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('ticket_number', sa.String(50), nullable=False),
        sa.Column('subject', sa.String(500), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('status', sa.Enum('open', 'pending', 'resolved', 'closed', name='ticketstatus'), server_default='open'),
        sa.Column('priority', sa.Enum('low', 'medium', 'high', 'urgent', name='ticketpriority'), server_default='medium'),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='SET NULL'), nullable=True),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='SET NULL'), nullable=True),
        sa.Column('assigned_to', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('resolved_at', sa.DateTime, nullable=True),
        sa.Column('closed_at', sa.DateTime, nullable=True),
        sa.Column('tags', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('custom_fields', postgresql.JSONB, server_default='{}'),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_tickets_workspace_id', 'tickets', ['workspace_id'])
    op.create_index('ix_tickets_ticket_number', 'tickets', ['ticket_number'])
    op.create_index('ix_tickets_status', 'tickets', ['status'])

    # Ticket Comments table
    op.create_table('ticket_comments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('ticket_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('tickets.id', ondelete='CASCADE'), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('is_internal', sa.Boolean, server_default='false'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_ticket_comments_ticket_id', 'ticket_comments', ['ticket_id'])

    # Articles (Knowledge Base) table
    op.create_table('articles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('slug', sa.String(500), nullable=False),
        sa.Column('category', sa.String(255), nullable=True),
        sa.Column('tags', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('is_published', sa.Boolean, server_default='false'),
        sa.Column('view_count', sa.Integer, server_default='0'),
        sa.Column('helpful_count', sa.Integer, server_default='0'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_articles_workspace_id', 'articles', ['workspace_id'])
    op.create_index('ix_articles_slug', 'articles', ['slug'])

    # Account Health table
    op.create_table('account_health',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('score', sa.Integer, nullable=False),
        sa.Column('status', sa.String(50), nullable=True),
        sa.Column('factors', postgresql.JSONB, server_default='{}'),
        sa.Column('ai_insights', postgresql.JSONB, server_default='{}'),
        sa.Column('calculated_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_account_health_workspace_id', 'account_health', ['workspace_id'])
    op.create_index('ix_account_health_company_id', 'account_health', ['company_id'])

    # Events table
    op.create_table('events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('event_name', sa.String(255), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('companies.id'), nullable=True),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id'), nullable=True),
        sa.Column('properties', postgresql.JSONB, server_default='{}'),
        sa.Column('occurred_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('ix_events_workspace_id', 'events', ['workspace_id'])
    op.create_index('ix_events_event_type', 'events', ['event_type'])
    op.create_index('ix_events_occurred_at', 'events', ['occurred_at'])

    # AI Agents table
    op.create_table('ai_agents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('agent_type', sa.String(50), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('status', sa.Enum('idle', 'busy', 'error', 'disabled', name='agentstatus'), server_default='idle'),
        sa.Column('config', postgresql.JSONB, server_default='{}'),
        sa.Column('system_prompt', sa.Text, nullable=True),
        sa.Column('model', sa.String(100), server_default='gpt-4-turbo-preview'),
        sa.Column('temperature', sa.Float, server_default='0.7'),
        sa.Column('long_term_memory', postgresql.JSONB, server_default='{}'),
        sa.Column('total_tasks', sa.Integer, server_default='0'),
        sa.Column('successful_tasks', sa.Integer, server_default='0'),
        sa.Column('failed_tasks', sa.Integer, server_default='0'),
        sa.Column('last_active_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_ai_agents_workspace_id', 'ai_agents', ['workspace_id'])
    op.create_index('ix_ai_agents_agent_type', 'ai_agents', ['agent_type'])

    # Agent Tasks table
    op.create_table('agent_tasks',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('agent_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ai_agents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('parent_task_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('agent_tasks.id', ondelete='SET NULL'), nullable=True),
        sa.Column('task_type', sa.String(100), nullable=False),
        sa.Column('priority', sa.String(50), server_default='medium'),
        sa.Column('status', sa.String(50), server_default='pending'),
        sa.Column('input_data', postgresql.JSONB, server_default='{}'),
        sa.Column('output_data', postgresql.JSONB, server_default='{}'),
        sa.Column('conversation_history', postgresql.JSONB, server_default='[]'),
        sa.Column('error_message', sa.Text, nullable=True),
        sa.Column('started_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_agent_tasks_agent_id', 'agent_tasks', ['agent_id'])
    op.create_index('ix_agent_tasks_status', 'agent_tasks', ['status'])

    # Agent Conversations table
    op.create_table('agent_conversations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('agent_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ai_agents.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=True),
        sa.Column('title', sa.String(500), nullable=True),
        sa.Column('messages', postgresql.JSONB, server_default='[]'),
        sa.Column('context', postgresql.JSONB, server_default='{}'),
        sa.Column('ended_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_agent_conversations_agent_id', 'agent_conversations', ['agent_id'])

    # Agent Knowledge table
    op.create_table('agent_knowledge',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('knowledge_type', sa.String(50), nullable=False),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('embedding', postgresql.JSONB, nullable=True),
        sa.Column('agent_types', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('metadata', postgresql.JSONB, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_agent_knowledge_workspace_id', 'agent_knowledge', ['workspace_id'])

    # Journeys table
    op.create_table('journeys',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('trigger', postgresql.JSONB, server_default='{}'),
        sa.Column('steps', postgresql.JSONB, server_default='[]'),
        sa.Column('status', sa.String(50), server_default='draft'),
        sa.Column('goal', sa.String(255), nullable=True),
        sa.Column('ai_optimized', sa.Boolean, server_default='false'),
        sa.Column('ai_suggestions', postgresql.JSONB, server_default='[]'),
        sa.Column('total_enrolled', sa.Integer, server_default='0'),
        sa.Column('total_completed', sa.Integer, server_default='0'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_journeys_workspace_id', 'journeys', ['workspace_id'])

    # Journey Enrollments table
    op.create_table('journey_enrollments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('journey_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('journeys.id', ondelete='CASCADE'), nullable=False),
        sa.Column('contact_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('contacts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(50), server_default='active'),
        sa.Column('current_step_index', sa.Integer, server_default='0'),
        sa.Column('next_step_at', sa.DateTime, nullable=True),
        sa.Column('goal_achieved', sa.Boolean, server_default='false'),
        sa.Column('enrolled_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_journey_enrollments_journey_id', 'journey_enrollments', ['journey_id'])
    op.create_index('ix_journey_enrollments_contact_id', 'journey_enrollments', ['contact_id'])

    # Campaigns table
    op.create_table('campaigns',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('campaign_type', sa.String(50), nullable=False),
        sa.Column('status', sa.Enum('draft', 'scheduled', 'active', 'paused', 'completed', name='campaignstatus'), server_default='draft'),
        sa.Column('budget', sa.Float, nullable=True),
        sa.Column('spent', sa.Float, server_default='0.0'),
        sa.Column('target_audience', postgresql.JSONB, server_default='{}'),
        sa.Column('scheduled_at', sa.DateTime, nullable=True),
        sa.Column('started_at', sa.DateTime, nullable=True),
        sa.Column('ended_at', sa.DateTime, nullable=True),
        sa.Column('metrics', postgresql.JSONB, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_campaigns_workspace_id', 'campaigns', ['workspace_id'])

    # Content Assets table
    op.create_table('content_assets',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('campaign_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('campaigns.id', ondelete='SET NULL'), nullable=True),
        sa.Column('asset_type', sa.String(50), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('file_url', sa.String(500), nullable=True),
        sa.Column('thumbnail_url', sa.String(500), nullable=True),
        sa.Column('ai_generated', sa.Boolean, server_default='false'),
        sa.Column('generation_prompt', sa.Text, nullable=True),
        sa.Column('generation_model', sa.String(100), nullable=True),
        sa.Column('version', sa.Integer, server_default='1'),
        sa.Column('metadata', postgresql.JSONB, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_content_assets_workspace_id', 'content_assets', ['workspace_id'])
    op.create_index('ix_content_assets_asset_type', 'content_assets', ['asset_type'])

    # Social Posts table
    op.create_table('social_posts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('campaign_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('campaigns.id', ondelete='SET NULL'), nullable=True),
        sa.Column('platform', sa.String(50), nullable=False),
        sa.Column('status', sa.String(50), server_default='draft'),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('media_urls', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('scheduled_for', sa.DateTime, nullable=True),
        sa.Column('published_at', sa.DateTime, nullable=True),
        sa.Column('engagement_metrics', postgresql.JSONB, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_social_posts_workspace_id', 'social_posts', ['workspace_id'])
    op.create_index('ix_social_posts_platform', 'social_posts', ['platform'])

    # Integrations table
    op.create_table('integrations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('integration_type', sa.Enum('crm', 'email', 'calendar', 'social', 'ads', 'enrichment', 'payment', 'analytics', 'communication', 'storage', name='integrationtype'), nullable=False),
        sa.Column('provider', sa.String(100), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('auth_type', sa.String(50), nullable=False),
        sa.Column('credentials', postgresql.JSONB, server_default='{}'),
        sa.Column('status', sa.String(50), server_default='active'),
        sa.Column('sync_direction', sa.String(50), server_default='bidirectional'),
        sa.Column('sync_frequency', sa.String(50), nullable=True),
        sa.Column('field_mappings', postgresql.JSONB, server_default='{}'),
        sa.Column('last_sync_at', sa.DateTime, nullable=True),
        sa.Column('last_sync_status', sa.String(50), nullable=True),
        sa.Column('config', postgresql.JSONB, server_default='{}'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
    )
    op.create_index('ix_integrations_workspace_id', 'integrations', ['workspace_id'])
    op.create_index('ix_integrations_integration_type', 'integrations', ['integration_type'])

    # Webhooks table
    op.create_table('webhooks',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('integration_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('integrations.id', ondelete='CASCADE'), nullable=True),
        sa.Column('webhook_type', sa.String(50), nullable=False),
        sa.Column('url', sa.String(500), nullable=False),
        sa.Column('secret', sa.String(255), nullable=True),
        sa.Column('events', postgresql.ARRAY(sa.String), server_default='{}'),
        sa.Column('headers', postgresql.JSONB, server_default='{}'),
        sa.Column('is_active', sa.Boolean, server_default='true'),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('ix_webhooks_workspace_id', 'webhooks', ['workspace_id'])

    # Webhook Logs table
    op.create_table('webhook_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('webhook_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('webhooks.id', ondelete='CASCADE'), nullable=False),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('payload', postgresql.JSONB, server_default='{}'),
        sa.Column('response_status', sa.Integer, nullable=True),
        sa.Column('response_body', sa.Text, nullable=True),
        sa.Column('error_message', sa.Text, nullable=True),
        sa.Column('delivered_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('ix_webhook_logs_webhook_id', 'webhook_logs', ['webhook_id'])

    # Audit Logs table
    op.create_table('audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('workspace_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('workspaces.id', ondelete='CASCADE'), nullable=False),
        sa.Column('actor_type', sa.String(50), nullable=False),
        sa.Column('actor_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource_type', sa.String(100), nullable=False),
        sa.Column('resource_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('changes', postgresql.JSONB, server_default='{}'),
        sa.Column('ip_address', sa.String(50), nullable=True),
        sa.Column('user_agent', sa.String(500), nullable=True),
        sa.Column('request_id', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )
    op.create_index('ix_audit_logs_workspace_id', 'audit_logs', ['workspace_id'])
    op.create_index('ix_audit_logs_actor_type', 'audit_logs', ['actor_type'])
    op.create_index('ix_audit_logs_action', 'audit_logs', ['action'])
    op.create_index('ix_audit_logs_created_at', 'audit_logs', ['created_at'])


def downgrade() -> None:
    # Drop all tables in reverse order
    op.drop_table('audit_logs')
    op.drop_table('webhook_logs')
    op.drop_table('webhooks')
    op.drop_table('integrations')
    op.drop_table('social_posts')
    op.drop_table('content_assets')
    op.drop_table('campaigns')
    op.drop_table('journey_enrollments')
    op.drop_table('journeys')
    op.drop_table('agent_knowledge')
    op.drop_table('agent_conversations')
    op.drop_table('agent_tasks')
    op.drop_table('ai_agents')
    op.drop_table('events')
    op.drop_table('account_health')
    op.drop_table('articles')
    op.drop_table('ticket_comments')
    op.drop_table('tickets')
    op.drop_table('email_sends')
    op.drop_table('email_campaigns')
    op.drop_table('email_templates')
    op.drop_table('sequence_enrollments')
    op.drop_table('sequence_steps')
    op.drop_table('sequences')
    op.drop_table('timeline')
    op.drop_table('notes')
    op.drop_table('activities')
    op.drop_table('deals')
    op.drop_table('pipelines')
    op.drop_table('leads')
    op.drop_table('contacts')
    op.drop_table('companies')
    op.drop_table('brand_kits')
    op.drop_table('workspace_members')
    op.drop_table('users')
    op.drop_table('workspaces')

    # Drop enums
    op.execute('DROP TYPE IF EXISTS campaignstatus')
    op.execute('DROP TYPE IF EXISTS emailstatus')
    op.execute('DROP TYPE IF EXISTS ticketpriority')
    op.execute('DROP TYPE IF EXISTS ticketstatus')
    op.execute('DROP TYPE IF EXISTS enrollmentstatus')
    op.execute('DROP TYPE IF EXISTS sequencestatus')
    op.execute('DROP TYPE IF EXISTS leadstatus')
    op.execute('DROP TYPE IF EXISTS integrationtype')
    op.execute('DROP TYPE IF EXISTS agentstatus')
    op.execute('DROP TYPE IF EXISTS activitystatus')
    op.execute('DROP TYPE IF EXISTS activitytype')
    op.execute('DROP TYPE IF EXISTS dealstage')
    op.execute('DROP TYPE IF EXISTS userrole')
    op.execute('DROP TYPE IF EXISTS workspacestatus')
    op.execute('DROP TYPE IF EXISTS subscriptiontier')
