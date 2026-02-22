/**
 * Tests for components/ChatMessage.tsx
 *
 * The component uses React Icons (SVG icons from react-icons) instead of
 * next/image, so avatar assertions check for <svg> elements rather than
 * <img> elements with src/alt attributes.
 *
 * Typewriter is mocked so animation tests are instant and deterministic.
 *
 * Covers:
 *  - User messages align right; system messages align left
 *  - Message text is rendered
 *  - System message avatar renders an SVG icon
 *  - User message avatar renders "You" text
 *  - Author name label is shown / hidden as expected
 *  - Agent-specific colour classes (blue / yellow / purple)
 *  - Default colour for unknown agents
 *  - Typewriter is used when animate=true
 *  - Plain text is used when animate=false (default)
 *  - bubbleClassName and avatarClassName are applied
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock('@/components/Typewriter', () => ({
  Typewriter: ({
    text,
    onComplete,
  }: {
    text: string;
    onComplete?: () => void;
  }) => (
    <span data-testid="typewriter" onClick={onComplete}>
      {text}
    </span>
  ),
}));

// Import AFTER mocks are declared
import ChatMessage from '@/components/ChatMessage';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const BASE_PROPS = {
  role: 'system' as const,
  text: 'Hello world',
};

// ── Layout / alignment ────────────────────────────────────────────────────────

describe('ChatMessage — layout', () => {
  it('system message is left-aligned (justify-start)', () => {
    const { container } = render(<ChatMessage {...BASE_PROPS} role="system" />);
    expect(container.firstChild).toHaveClass('justify-start');
  });

  it('user message is right-aligned (justify-end)', () => {
    const { container } = render(<ChatMessage {...BASE_PROPS} role="user" />);
    expect(container.firstChild).toHaveClass('justify-end');
  });
});

// ── Text rendering ────────────────────────────────────────────────────────────

describe('ChatMessage — text', () => {
  it('renders the message text', () => {
    render(<ChatMessage {...BASE_PROPS} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('uses a <p> tag for the text content', () => {
    const { container } = render(<ChatMessage {...BASE_PROPS} />);
    expect(container.querySelector('p')).toBeInTheDocument();
  });
});

// ── Avatar ────────────────────────────────────────────────────────────────────

describe('ChatMessage — avatar', () => {
  it('system message renders an SVG icon in the avatar container', () => {
    const { container } = render(<ChatMessage {...BASE_PROPS} role="system" />);
    // The avatar wrapper has rounded-full; it should contain an <svg> from react-icons
    const avatarWrapper = container.querySelector('.rounded-full');
    expect(avatarWrapper).toBeInTheDocument();
    expect(avatarWrapper?.querySelector('svg')).toBeInTheDocument();
  });

  it('user message renders "You" text in the avatar container', () => {
    const { container } = render(<ChatMessage {...BASE_PROPS} role="user" />);
    const avatarWrapper = container.querySelector('.rounded-full');
    expect(avatarWrapper?.textContent).toContain('You');
  });
});

// ── Author name label ─────────────────────────────────────────────────────────

describe('ChatMessage — author name', () => {
  it('displays the author name when provided', () => {
    render(<ChatMessage {...BASE_PROPS} authorName="GPT-5 nano" />);
    expect(screen.getByText('GPT-5 nano')).toBeInTheDocument();
  });

  it('does not render a name element when authorName is absent', () => {
    const { container } = render(<ChatMessage {...BASE_PROPS} />);
    // The name label is a .text-xs div — should not exist without the prop
    const nameElements = container.querySelectorAll('.text-xs');
    expect(nameElements.length).toBe(0);
  });
});

// ── Agent colour coding ───────────────────────────────────────────────────────

describe('ChatMessage — agent name colours', () => {
  it('applies blue colour for GPT-5 nano', () => {
    const { container } = render(
      <ChatMessage {...BASE_PROPS} authorName="GPT-5 nano" />,
    );
    expect(container.querySelector('.text-blue-400')).toBeInTheDocument();
  });

  it('applies yellow colour for Gemma 2', () => {
    const { container } = render(
      <ChatMessage {...BASE_PROPS} authorName="Gemma 2" />,
    );
    expect(container.querySelector('.text-yellow-400')).toBeInTheDocument();
  });

  it('applies purple colour for LLaMA 3.3', () => {
    const { container } = render(
      <ChatMessage {...BASE_PROPS} authorName="LLaMA 3.3" />,
    );
    expect(container.querySelector('.text-purple-400')).toBeInTheDocument();
  });

  it('uses the default muted colour for an unknown agent', () => {
    const { container } = render(
      <ChatMessage {...BASE_PROPS} authorName="UnknownBot" />,
    );
    // Should not have any of the specific colour classes
    expect(container.querySelector('.text-blue-400')).not.toBeInTheDocument();
    expect(container.querySelector('.text-yellow-400')).not.toBeInTheDocument();
    expect(container.querySelector('.text-purple-400')).not.toBeInTheDocument();
    // But should still have the default colour class
    expect(container.querySelector('.text-white\\/70')).toBeInTheDocument();
  });
});

// ── Animate / Typewriter ──────────────────────────────────────────────────────

describe('ChatMessage — animation', () => {
  it('renders plain text by default (animate=false)', () => {
    render(<ChatMessage {...BASE_PROPS} />);
    expect(screen.queryByTestId('typewriter')).not.toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders the Typewriter component when animate=true', () => {
    render(<ChatMessage {...BASE_PROPS} animate={true} />);
    expect(screen.getByTestId('typewriter')).toBeInTheDocument();
  });

  it('passes the message text to Typewriter', () => {
    render(<ChatMessage {...BASE_PROPS} text="Typing this out" animate={true} />);
    expect(screen.getByTestId('typewriter').textContent).toBe('Typing this out');
  });

  it('passes onAnimationComplete through to Typewriter (onClick)', () => {
    const onComplete = vi.fn();
    render(
      <ChatMessage
        {...BASE_PROPS}
        animate={true}
        onAnimationComplete={onComplete}
      />,
    );
    // Our mock Typewriter fires onComplete on click
    screen.getByTestId('typewriter').click();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});

// ── Custom class names ────────────────────────────────────────────────────────

describe('ChatMessage — className props', () => {
  it('applies bubbleClassName to the article element', () => {
    const { container } = render(
      <ChatMessage {...BASE_PROPS} bubbleClassName="custom-bubble" />,
    );
    expect(container.querySelector('.custom-bubble')).toBeInTheDocument();
  });

  it('applies avatarClassName to the avatar wrapper', () => {
    const { container } = render(
      <ChatMessage {...BASE_PROPS} avatarClassName="custom-avatar" />,
    );
    expect(container.querySelector('.custom-avatar')).toBeInTheDocument();
  });
});
