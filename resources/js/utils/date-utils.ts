'use client';

/**
 * Date utility functions for formatting and manipulating dates
 * This file provides alternatives to date-fns functions
 */

/**
 * Format a date into a localized Indonesian format
 * Equivalent to format(date, 'PPP') in date-fns
 *
 * @param date The date to format
 * @returns Formatted date string in Indonesian format: "Hari, DD Bulan YYYY"
 */
export const formatFullDate = (date: Date): string => {
    // Indonesian month names
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    // Day names
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    // Format as "Hari, DD Bulan YYYY"
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const dayName = dayNames[date.getDay()];

    return `${dayName}, ${day} ${month} ${year}`;
};

/**
 * Format a date into a short date format
 * Equivalent to format(date, 'dd-MM-yyyy') in date-fns
 *
 * @param date The date to format
 * @returns Formatted date string in short format: "DD-MM-YYYY"
 */
export const formatShortDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

/**
 * Format a date with time
 * Equivalent to format(date, 'dd-MM-yyyy, HH:mm') in date-fns
 *
 * @param date The date to format
 * @returns Formatted date string with time: "DD-MM-YYYY, HH:MM"
 */
export const formatDateWithTime = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
};

/**
 * Parse an ISO date string to a Date object
 * Equivalent to parseISO from date-fns
 *
 * @param dateString ISO date string
 * @returns JavaScript Date object
 */
export const parseISODate = (dateString: string): Date => {
    return new Date(dateString);
};

/**
 * Format a date for UI display
 * Simplified version for DatePicker component
 *
 * @param date Date to format
 * @returns Formatted date string in Indonesian format: "DD Bulan YYYY"
 */
export const formatDate = (date: Date): string => {
    // Indonesian month names
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

/**
 * Format a date into a locale string format (using browser's native formatting)
 *
 * @param date The date to format
 * @param locale The locale to use, defaults to Indonesian
 * @returns Formatted date string using toLocaleDateString
 */
export const formatLocale = (date: Date, locale = 'id-ID', options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return date.toLocaleDateString(locale, options || defaultOptions);
};

/**
 * Parse a date string in YYYY-MM-DD format and convert to formatted Indonesian date
 * 
 * @param dateString Date string in YYYY-MM-DD format (e.g., "2025-04-20")
 * @returns Formatted date string in Indonesian format: "DD Bulan YYYY" (e.g., "20 April 2025")
 */
export const parseAndFormatDate = (dateString: Date): string => {
    // Create a new Date from the string (assuming YYYY-MM-DD format)
    const date = new Date(dateString);
    
    // Return the formatted date
    return formatDate(date);
};