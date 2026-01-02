'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { Modal, Button, Badge, SolanaLogo } from '../ui';
import { useApp } from '@/context/AppContext';
import { CATEGORY_INFO, DIFFICULTY_INFO, formatSOL } from '@/data/tasks';

const ProofUploadModal: React.FC = () => {
  const { selectedTask, isProofModalOpen, setIsProofModalOpen, submitProof, userStats } = useApp();
  const { publicKey } = useWallet();

  const [step, setStep] = useState<'info' | 'upload' | 'verifying' | 'pending' | 'error'>('info');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [xPostUrl, setXPostUrl] = useState('');
  const [proofMethod, setProofMethod] = useState<'image' | 'xlink'>('image');

  const handleClose = useCallback(() => {
    setIsProofModalOpen(false);
    setStep('info');
    setProofFile(null);
    setProofPreview(null);
    setNotes('');
    setIsSubmitting(false);
    setErrorMessage('');
    setXPostUrl('');
    setProofMethod('image');
  }, [setIsProofModalOpen]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File too large. Maximum size is 10MB.');
        return;
      }
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleStartTask = useCallback(() => {
    setStep('upload');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedTask || !publicKey) return;

    setIsSubmitting(true);
    setStep('verifying');
    setErrorMessage('');

    try {
      const result = await submitProof(
        selectedTask.id,
        proofFile,
        notes,
        proofMethod === 'xlink' ? xPostUrl : undefined
      );

      if (result.success) {
        setStep('pending');
      } else {
        setErrorMessage(result.error || 'Submission failed. Please try again.');
        setStep('error');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedTask, publicKey, proofFile, notes, xPostUrl, proofMethod, submitProof]);

  // Generate Share to X URL
  const getShareToXUrl = useCallback(() => {
    if (!selectedTask) return '';
    const text = `$SOBER - Sober Made Fun\n\nJust crushed the "${selectedTask.title}" task! 💪\n\nTackling my NYE goals and earning $SOBER tokens along the way.\n\nLevel up your life, smash bad habits, get rewarded.\n\n#SOBER #SoberMadeFun #Solana #NewYearGoals`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  }, [selectedTask]);

  const handleShareToX = useCallback(() => {
    window.open(getShareToXUrl(), '_blank', 'width=550,height=420');
  }, [getShareToXUrl]);

  const handleRetry = useCallback(() => {
    setStep('upload');
    setErrorMessage('');
  }, []);

  if (!selectedTask) return null;

  const categoryInfo = CATEGORY_INFO[selectedTask.category];
  const difficultyInfo = DIFFICULTY_INFO[selectedTask.difficulty];

  // Check if user has tier bonus
  const tierBonus = userStats ? userStats.tierLevel > 1 : false;

  return (
    <Modal
      isOpen={isProofModalOpen}
      onClose={handleClose}
      title={
        step === 'pending' ? 'Submission Received!' :
        step === 'verifying' ? 'Submitting...' :
        step === 'error' ? 'Submission Failed' :
        selectedTask.title
      }
      size="md"
    >
      {step === 'info' && (
        <div className="space-y-6">
          {/* Task Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-sober-blue-dark to-sober-blue-darker flex items-center justify-center">
              <Image
                src={selectedTask.icon}
                alt={selectedTask.title}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          {/* Task Info */}
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-3">
              <Badge variant="default" size="md" className={categoryInfo.color}>
                {categoryInfo.label}
              </Badge>
              <Badge variant="default" size="md" className={difficultyInfo.color}>
                {difficultyInfo.label}
              </Badge>
              {tierBonus && (
                <Badge variant="default" size="md" className="bg-yellow-500/20 text-yellow-400">
                  {userStats?.tier} Tier
                </Badge>
              )}
            </div>
            <p className="text-gray-300">{selectedTask.description}</p>
          </div>

          {/* Reward - SOL */}
          <div className="bg-gradient-to-r from-sober-gold/10 to-[#9945FF]/10 border border-sober-gold/30 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-gray-400 mb-1">Earn</div>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <SolanaLogo size={28} />
              <span className="text-2xl sm:text-3xl font-bold gradient-solana">+{formatSOL(selectedTask.rewardAmount)}</span>
              <span className="text-gray-400 text-base sm:text-lg">SOL</span>
            </div>
            {tierBonus && userStats && (
              <div className="mt-2 text-xs sm:text-sm text-yellow-400">
                {userStats.tier} Tier bonus unlocked!
              </div>
            )}
          </div>

          {/* Wallet Info */}
          {publicKey && (
            <div className="bg-sober-green/10 border border-sober-green/30 rounded-xl p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">Rewards sent automatically to</div>
              <div className="font-mono text-xs sm:text-sm text-white">
                {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-6)}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="bg-white/5 rounded-xl p-3 sm:p-4">
            <h4 className="text-white font-medium mb-2 text-sm sm:text-base">How to complete:</h4>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              {selectedTask.proofType === 'image' && (
                <>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-sober-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Upload a photo OR share on X and paste link
                  </li>
                </>
              )}
              {(selectedTask.proofType === 'check-in' || selectedTask.proofType === 'streak') && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-sober-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  One-click check-in - no uploads needed
                </li>
              )}
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sober-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Approved? SOL sent directly to your wallet
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <Button variant="gold" className="w-full" onClick={handleStartTask}>
            Let&apos;s Go!
          </Button>
        </div>
      )}

      {step === 'upload' && (
        <div className="space-y-6">
          {/* Upload Area */}
          {selectedTask.proofType === 'image' || selectedTask.proofType === 'video' ? (
            <div className="space-y-4">
              {/* Proof Method Toggle */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
                <button
                  onClick={() => setProofMethod('image')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    proofMethod === 'image'
                      ? 'bg-sober-blue text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Upload Image
                </button>
                <button
                  onClick={() => setProofMethod('xlink')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    proofMethod === 'xlink'
                      ? 'bg-sober-blue text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  X Post Link
                </button>
              </div>

              {proofMethod === 'image' ? (
                <label className="block">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      proofPreview
                        ? 'border-sober-green/50 bg-sober-green/5'
                        : 'border-white/20 hover:border-sober-blue/50 hover:bg-white/5'
                    }`}
                  >
                    {proofPreview ? (
                      <div className="space-y-4">
                        <img
                          src={proofPreview}
                          alt="Proof preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <p className="text-sober-green text-sm">
                          {proofFile?.name}
                        </p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-300 mb-2">
                          Click to upload your proof
                        </p>
                        <p className="text-gray-500 text-sm">
                          PNG, JPG, or GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  {/* Share to X Button */}
                  <button
                    onClick={handleShareToX}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Share to X (Twitter)
                  </button>
                  <p className="text-gray-400 text-xs text-center">
                    Click above to create your post, then paste the link below
                  </p>

                  {/* X Post URL Input */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      X Post Link
                    </label>
                    <input
                      type="url"
                      value={xPostUrl}
                      onChange={(e) => setXPostUrl(e.target.value)}
                      placeholder="https://x.com/username/status/..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-sober-blue/50"
                    />
                    {xPostUrl && !/^https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/i.test(xPostUrl) && (
                      <p className="text-red-400 text-xs mt-1">Please enter a valid X/Twitter post URL</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-sober-green/10 border border-sober-green/30 rounded-xl p-6 text-center">
              <svg className="w-12 h-12 mx-auto text-sober-green mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-white font-medium mb-2">Ready for Check-In</p>
              <p className="text-gray-400 text-sm">
                Click submit to record your {selectedTask.proofType === 'streak' ? 'daily progress' : 'check-in'}
              </p>
            </div>
          )}

          {/* Optional Notes */}
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Share your experience or add context..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-sober-blue/50 resize-none"
              rows={3}
              maxLength={500}
            />
            <p className="text-gray-500 text-xs mt-1">{notes.length}/500 characters</p>
          </div>

          {/* Submit Button */}
          <Button
            variant="gold"
            className="w-full"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={
              isSubmitting ||
              (selectedTask.proofType === 'image' && proofMethod === 'image' && !proofFile) ||
              (selectedTask.proofType === 'image' && proofMethod === 'xlink' && !xPostUrl) ||
              (proofMethod === 'xlink' && xPostUrl && !/^https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/i.test(xPostUrl))
            }
          >
            Submit for Verification
          </Button>

          {/* Privacy Note */}
          <p className="text-gray-500 text-xs text-center">
            Your submission is reviewed by our verification team. No personal data is stored or shared.
          </p>
        </div>
      )}

      {step === 'verifying' && (
        <div className="text-center space-y-6 py-8">
          {/* Loading Animation */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-sober-blue/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-sober-blue rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-[#9945FF] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <SolanaLogo size={32} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">Uploading Proof...</h3>
            <p className="text-gray-400">
              Please wait while we process your submission
            </p>
          </div>
        </div>
      )}

      {step === 'error' && (
        <div className="text-center space-y-6">
          {/* Error Icon */}
          <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Submission Failed</h3>
            <p className="text-red-400">{errorMessage}</p>
          </div>

          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={handleRetry}>
              Try Again
            </Button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 'pending' && (
        <div className="text-center space-y-4 sm:space-y-6">
          {/* Pending Icon */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-sober-green/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-sober-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Task Submitted!</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              <span className="text-sober-gold font-semibold">{selectedTask.title}</span> is pending review
            </p>
          </div>

          {/* Wallet Address Display */}
          {publicKey && (
            <div className="bg-sober-green/10 border border-sober-green/30 rounded-xl p-3 sm:p-4">
              <div className="text-xs text-gray-400 mb-1">SOL will be sent to</div>
              <div className="font-mono text-sm sm:text-base text-white break-all">
                {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-6)}
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-sober-orange/20 border border-sober-orange/30 rounded-full">
            <div className="w-2 h-2 bg-sober-orange rounded-full animate-pulse"></div>
            <span className="text-sober-orange font-medium text-sm sm:text-base">Awaiting Review</span>
          </div>

          {/* Info Card */}
          <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-left">
            <h4 className="text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base">What happens next?</h4>
            <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-sober-blue mt-0.5">1.</span>
                Quick review by our team (usually within hours)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sober-blue mt-0.5">2.</span>
                Once approved, you level up automatically
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sober-green mt-0.5">3.</span>
                <span className="text-sober-green">SOL sent directly to your wallet - no claiming needed!</span>
              </li>
            </ul>
          </div>

          {/* Reward Preview */}
          <div className="bg-gradient-to-r from-sober-gold/10 to-[#9945FF]/10 border border-sober-gold/30 rounded-xl p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">Reward (upon approval)</div>
            <div className="flex items-center justify-center gap-2">
              <SolanaLogo size={24} />
              <span className="text-xl sm:text-2xl font-bold gradient-solana">+{formatSOL(selectedTask.rewardAmount)}</span>
              <span className="text-gray-400 text-sm sm:text-base">SOL</span>
            </div>
          </div>

          {/* Share to X */}
          <button
            onClick={handleShareToX}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Share on X (Twitter)
          </button>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={handleClose}>
              View More Tasks
            </Button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProofUploadModal;
