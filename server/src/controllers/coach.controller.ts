                                                              import { Request, Response } from 'express';
                                                              import { RequestWithUser } from '../middleware/auth';
                                                              // Removed duplicate import of RequestWithUser
                                                              import Coach from '../models/Coach';

                                                              export const getAllCoaches = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10, page = 1, specialization, tag, sortBy = 'createdAt', sortOrder = -1 } = req.query;
    // Parse numeric parameters
    const parsedLimit = parseInt(limit as string) || 10;
    const parsedPage = parseInt(page as string) || 1;
    const skip = (parsedPage - 1) * parsedLimit;
    // Build filter based on query parameters
    const filter: any = { isActive: true };
    if (specialization) {
      filter.specializations = specialization;
    }
    if (tag) {
      filter.tags = tag;
    }
    // Get total count for pagination info
    const totalCount = await Coach.countDocuments(filter);
    // Create sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === '-1' || sortOrder === -1 ? -1 : 1;
    // Execute query with pagination
    const coaches = await Coach.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Math.min(parsedLimit, 100)); // Maximum 100 coaches per request
    // Always include success: true in response
    res.status(200).json({
      success: true,
      count: coaches.length,
      totalCount,
      page: parsedPage,
      totalPages: Math.ceil(totalCount / parsedLimit),
      hasMore: skip + coaches.length < totalCount,
      data: coaches
    });
  } catch (error) {
    console.error('Error getting coaches:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
                                                              };

                                                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                              export const getCoachById = async (req: Request, res: Response): Promise<void> => {
                                                                try {
                                                                  const coach = await Coach.findById(req.params.id);
                                                                  
                                                                  if (!coach || !coach.isActive) {
                                                                    res.status(404).json({
                                                                      success: false,
                                                                      error: 'Coach not found'
                                                                    });
                                                                    return;
                                                                  }
                                                                  
                                                                  res.status(200).json({
                                                                    success: true,
                                                                    data: coach
                                                                  });
                                                                } catch (error) {
                                                                  console.error('Error getting coach by ID:', error);
                                                                  res.status(500).json({
                                                                    success: false,
                                                                    error: 'Server Error'
                                                                  });
                                                                }
                                                              }
                                                              export const createCoach = async (req: RequestWithUser, res: Response): Promise<void> => {
                                                                try {
                                                                  // ADMIN CHECK DISABLED FOR DEV
                                                                  // if (req.user?.role !== 'admin') {
                                                                  //   res.status(403).json({
                                                                  //     success: false,
                                                                  //     error: 'Unauthorized: Admin access required'
                                                                  //   });
                                                                  //   return;
                                                                  // }

                                                                  // Ensure applicationId is present
                                                                  let coachPayload = { ...req.body };
                                                                  if (!coachPayload.applicationId) {
                                                                    // Use uuid for guaranteed uniqueness
                                                                    const { v4: uuidv4 } = require('uuid');
                                                                    coachPayload.applicationId = `APP-${uuidv4()}`;
                                                                  }

                                                                  const coach = await Coach.create(coachPayload);
    
                                                                  res.status(201).json({
                                                                    success: true,
                                                                    data: coach
                                                                  });
                                                                } catch (error: any) {
                                                                  console.error('Error creating coach:', error);
                                                                  if (error.name === 'ValidationError') {
                                                                    const messages = Object.values(error.errors).map((val: any) => val.message);
                                                                    res.status(400).json({
                                                                      success: false,
                                                                      error: messages
                                                                    });
                                                                  } else {
                                                                    res.status(500).json({
                                                                      success: false,
                                                                      error: 'Server Error'
                                                                    });
                                                                  }
                                                                }
                                                              }

                                                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                              export const updateCoach = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    // ADMIN CHECK DISABLED FOR DEV
    // console.log(req.user?.role);
    // if (req.user?.role !== 'admin') {
    //   res.status(403).json({
    //     success: false,
    //     error: 'Unauthorized: Admin access required'
    //   });
    //   return;
    // }

    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!coach) {
      res.status(404).json({
        success: false,
        error: 'Coach not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error: any) {
    console.error('Error updating coach:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}
                                                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                              export const deleteCoach = async (req: RequestWithUser, res: Response): Promise<void> => {
                                                                try {
                                                                  // ADMIN CHECK DISABLED FOR DEV
                                                                  // if (req.user?.role !== 'admin') {
                                                                  //   res.status(403).json({
                                                                  //     success: false,
                                                                  //     error: 'Unauthorized: Admin access required'
                                                                  //   });
                                                                  //   return;
                                                                  // }

                                                                  const coach = await Coach.findByIdAndUpdate(
                                                                    req.params.id,
                                                                    { isActive: false },
                                                                    { new: true }
                                                                  );
                                                                  
                                                                  if (!coach) {
                                                                    res.status(404).json({
                                                                      success: false,
                                                                      error: 'Coach not found'
                                                                    });
                                                                    return;
                                                                  }
                                                                  
                                                                  res.status(200).json({
                                                                    success: true,
                                                                    data: {}
                                                                  });
                                                                } catch (error) {
                                                                  console.error('Error soft deleting coach:', error);
                                                                  res.status(500).json({
                                                                    success: false,
                                                                    error: 'Server Error'
                                                                  });
                                                                }
                                                              };

                                                              // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                              export const hardDeleteCoach = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    // ADMIN CHECK DISABLED FOR DEV
    // if (req.user?.role !== 'admin') {
    //   res.status(403).json({
    //     success: false,
    //     error: 'Unauthorized: Admin access required'
    //   });
    //   return;
    // }

    const coach = await Coach.findByIdAndDelete(req.params.id);
    
    if (!coach) {
      res.status(404).json({
        success: false,
        error: 'Coach not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error hard deleting coach:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}
