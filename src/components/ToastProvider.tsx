import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "motion/react"
import { clearToast } from '../store/toastSlice';
import DefaultText from './DefaultText';
import { RootState } from '../store';

export interface ToastProps {
  title: string | undefined,
  subtitle?: string | undefined,
  type: 'info' | 'success' | 'error',
  onConfirm?: any | undefined,
  confirmText?: string,
  timer?: number,
  hideTimer?: boolean,
}

const ToastProvider: React.FC = () => {
  const toastQueue = useSelector((state: RootState) => state.toast.queue);
  const [currentToast, setCurrentToast] = useState<ToastProps | null>(null);
  const dispatch = useDispatch();
  const [startX, setStartX] = useState(-400);
  const [endX, setEndX] = useState(4);

  const colorCodes = {
    success: 'var(--accent-primary)',
    error: 'var(--error)',
    info: 'var(--accent-primary)',
  };

  useEffect(() => {
    if (toastQueue.length > 0 && !currentToast) {
      setCurrentToast(toastQueue[0]);
    }
  }, [toastQueue, currentToast]);

  useEffect(() => {
    setStartX(-400);
    setEndX(4);
  }, [currentToast]);

  const onAnimationDone = () => {
    setStartX(4);
    setEndX(-400);
  }

  return currentToast && (
    <motion.div className='relative' style={{ top: 4, right: startX }} animate={{ right: endX }} transition={{ duration: 1 }} onAnimationComplete={endX === -400 ? () => {
      dispatch(clearToast());
      setCurrentToast(null);
    } : undefined}>
      <div
        className='absolute top-4 right-4 rounded-lg max-w-400 border-4 justify-start items-start p-4 z-50'
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: colorCodes[currentToast.type],
        }}>
        <div className='flex justify-between'>
          <DefaultText
            weight='bold'
            className={!currentToast.hideTimer ? 'pb-4' : undefined}
          >
            {currentToast?.title}
          </DefaultText>
        </div>
        <motion.div
          className='rounded-md'
          style={{ width: '0%', backgroundColor: colorCodes[currentToast.type], height: currentToast.hideTimer ? 0 : 5 }}
          animate={{ width: '100%' }}
          transition={{ duration: 3 }}
          onAnimationComplete={() => onAnimationDone()}
        />
      </div>
    </motion.div>
  );
};

export default ToastProvider;