<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class FollowUpMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $user;
    public $subjectString;
    public $contentView;
    public $data;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $subject, string $contentView, array $data = [])
    {
        $this->user = $user;
        $this->subjectString = $subject;
        $this->contentView = $contentView;
        $this->data = $data;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectString,
            to: [$this->user->email],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: $this->contentView,
            with: $this->data,
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
